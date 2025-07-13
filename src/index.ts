import EventEmitter from 'events';
import { createReadStream } from 'fs';
import type { Metadata } from './interfaces';

export * from './interfaces';
export default class ShairportSyncReaderSimple {
  private events = new EventEmitter();
  private xmlCache = '';

  /**
   * 
   * @param pipe the path to the named pipe that Shairport Sync writes to.
   */
  constructor(pipe: string) {
    createReadStream(pipe, { encoding: 'utf8' })
      .on('data', (data: string) => {
        this.xmlCache += data.replace(/\r?\n|\r/g, '');
        let firstItem = this.xmlCache.indexOf('<item>');
        let lastItem = this.xmlCache.lastIndexOf('</item>');
        const itemLength = '</item>'.length;
        if (firstItem > 0) {
          console.warn('WARNING: An item did not contain the proper start sequence "<item>".');
          console.warn('WARNING: This incomplete item will be ignored.');
          this.xmlCache = this.xmlCache.substring(firstItem); // Remove everything before the first tag
          firstItem = this.xmlCache.indexOf('<item>'); // Recalculate firstItem after trimming
          lastItem = this.xmlCache.lastIndexOf('</item>'); // Recalculate lastItem after trimming
        }
        if (firstItem === -1 || lastItem === -1) {
          return; // Not enough data to process
        }
        const xml = this.xmlCache.substring(firstItem, lastItem + itemLength);
        this.xmlCache = this.xmlCache.substring(lastItem + itemLength); // Remove processed XML
        this.handleData(xml);
      })
      .on('error', (err: Error) => this.events.emit('error', err));
  }


  private handleData(xml: string) {
    const itemRegex = /<item><type>(.*?)<\/type><code>(.*?)<\/code><length>(\d+)<\/length>(?:<data encoding="base64">(.*?)<\/data>)?<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const [fullMatch, typeHex, codeHex, length, base64Data] = match;

      const type = Buffer.from(typeHex, 'hex').toString('utf8');
      const code = Buffer.from(codeHex, 'hex').toString('utf8');
      const data = base64Data ? Buffer.from(base64Data, 'base64').toString('utf8') : null;

      this.events.emit(type, code, data);
      if (data) {
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
      } else {
        this.events.emit(code);
      }

      // Remove the processed item from the XML
      xml = xml.replace(fullMatch, ''); //data.substring(data.indexOf(fullMatch) + fullMatch.length);
      itemRegex.lastIndex = 0; // Reset regex index to allow for multiple matches in the same data chunk  
    }
  }

  on(event: 'core', listener: (code: string, data: string) => void): this;
  on(event: 'ssnc', listener: (code: string, data: string) => void): this;
  on<T extends keyof Metadata>(event: T, listener: (data: Metadata[T]) => void): this;
  on<T extends keyof Metadata>(event: T | string, listener: (codeOrData: Metadata[T] | string, data: string) => void): this {
    this.events.on(event, listener);
    return this;
  }
}