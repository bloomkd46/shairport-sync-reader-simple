import EventEmitter from 'events';
import { createReadStream } from 'fs';
import type { Metadata } from './interfaces';

export * from './interfaces';
export default class ShairportSyncReaderSimple {
  private events = new EventEmitter();
  private xml = '';

  /**
   * 
   * @param pipe the path to the named pipe that Shairport Sync writes to.
   */
  constructor(pipe: string) {
    createReadStream(pipe, { encoding: 'utf8' })
      .on('data', (data: string) => this.handleData(data))
      .on('error', (err: Error) => this.events.emit('error', err));
  }

  private isProcessing = false;

  private handleData(data: string) {
    this.xml += data;

    if (this.isProcessing) return;

    this.isProcessing = true;

    // Normalize the XML string by removing line breaks
    this.xml = this.xml.replace(/\r?\n|\r/g, '');

    const itemRegex = /<item><type>(.*?)<\/type><code>(.*?)<\/code><length>(\d+)<\/length><data encoding="base64">(.*?)<\/data><\/item>/g;
    let match;

    while ((match = itemRegex.exec(this.xml)) !== null) {
      const [fullMatch, typeHex, codeHex, length, base64Data] = match;

      const type = Buffer.from(typeHex, 'hex').toString('utf8');
      const code = Buffer.from(codeHex, 'hex').toString('utf8');
      const data = Buffer.from(base64Data, 'base64').toString('utf8');

      this.events.emit(type, code, data);

      if (type === 'ssnc') {
        switch (code) {
          case 'pvol':
            const [airplayVolume, volume, lowestVolume, highestVolume] = data.split(',');
            this.events.emit('pvol', {
              airplayVolume: parseFloat(airplayVolume),
              volume: parseFloat(volume),
              lowestVolume: parseFloat(lowestVolume),
              highestVolume: parseFloat(highestVolume)
            });
            break;
          case 'prgr':
            const [start, current, end] = data.split(',').map(Number);
            this.events.emit('prgr', { start, current, end });
            break;
          case 'mdst':
          case 'mden':
          case 'pcst':
          case 'pcen':
            const timestamp = parseInt(data, 10);
            this.events.emit(code, isNaN(timestamp) ? null : timestamp);
            break;
          default:
            this.events.emit(code, data);
            break;
        }
      }
      if (type === 'core') {
        switch (code) {
          case 'astm':
            this.events.emit('astm', parseInt(data, 10));
            break;
          case 'asdk':
            this.events.emit('asdk', parseInt(data, 10));
            break;
          default:
            this.events.emit(code, data);
            break;
        }
      }

      // Remove the processed item from the XML
      this.xml = this.xml.replace(fullMatch, '');
    }

    this.isProcessing = false;
  }

  on(event: 'core', listener: (code: string, data: string) => void): this;
  on(event: 'ssnc', listener: (code: string, data: string) => void): this;
  on<T extends keyof Metadata>(event: T, listener: (data: Metadata[T]) => void): this;
  on<T extends keyof Metadata>(event: T | string, listener: (codeOrData: Metadata[T] | string, data: string) => void): this {
    this.events.on(event, listener);
    return this;
  }
}