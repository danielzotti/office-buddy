import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NfcService {

  hasNfcCapability = false;
  ndef: NDEFReader | undefined;

  constructor() {
    console.log('NfcService');
  }

  init(): void {
    if('NDEFReader' in window) {
      this.hasNfcCapability = true;

      this.ndef = new NDEFReader();
      console.log('This browser has NFC capability! <3');
      void this.initScan();
    } else {
      console.log('No NFC capability');
    }
  }

  async initScan() {
    if(!this.ndef) {
      console.log('No NFC capability');
      return;
    }
    try {
      const res = await this.ndef.scan();

      console.log('Scan started successfully.', res);
      this.ndef.onreadingerror = () => {
        console.log('Cannot read data from the NFC tag. Try another one?');
      };
      this.ndef.onreading = (event: NDEFReadingEvent) => {
        console.log('NDEF message read.', event);
      };
    } catch(error) {
      console.log(`Error! Scan failed to start: ${ error }.`);
    }
  }

}
