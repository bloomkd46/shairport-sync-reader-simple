# Shairport Sync Reader Simple
A simple Node.js program to extract metadata from Shairport Sync via a pipe.

## Features
- Extracts metadata from Shairport Sync output
- Provides TypeScript types for metadata structure
- Easy to use with Node.js streams

## Limitations
- Currently only extracts data via a pipe

## Usage
   ```typescript
   import { ShairportSyncReader } from 'shairport-sync-reader-simple';

    const reader = new ShairportSyncReader();
    // Catch raw metadata events
    reader.on('ssnc', (code, data) => {
      console.log('Received shairport-sync metadata:', code, data);
    });
    reader.on('core', (code, data) => {
      console.log('Received core (iTunes) metadata:', code, data);
    });

    // Catch parsed metadata events (As defined on https://github.com/mikebrady/shairport-sync-metadata-reader)
    reader.on('pvol', (volume) => {
      console.log('Airplay volume:', volume.airplayVolume, 'Volume:', volume.volume, 'Minimum Volume:', volume.lowestVolume, 'Maximum Volume:', volume.highestVolume);
    });
   ```