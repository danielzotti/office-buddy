import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private ndef: NDEFReader | undefined;
  // private ndefRead: NDEFReader | undefined;
  // private ndefWrite: NDEFReader | undefined;
  // private readAbortController = new AbortController();
  // private writeAbortController = new AbortController();
  private abortController = new AbortController();

  hasNfcCapability$ = new BehaviorSubject<boolean>(false);
  permissionState$ = new BehaviorSubject<PermissionState>('denied');
  readRunningState$ = new BehaviorSubject<'started' | 'stopped'>('stopped');
  writeRunningState$ = new BehaviorSubject<'started' | 'stopped'>('stopped');
  messages$ = new Subject<any>();

  constructor() {
  }

  async init() {

    if('NDEFReader' in window) {
      console.debug('[NfcService] This browser has NFC capability! <3');
      this.hasNfcCapability$.next(true);

      const nfcPermissionStatus = await navigator.permissions.query({ name: 'nfc' } as unknown as PermissionDescriptor);

      this.permissionState$.next(nfcPermissionStatus.state);

      nfcPermissionStatus.onchange = () => {
        console.debug('[NfcService] The user decided to change his settings. New permission: ' + nfcPermissionStatus.state);
        this.permissionState$.next(nfcPermissionStatus.state);
        if(nfcPermissionStatus.state === 'denied') {
          this.stopRead();
        }
      };

      if(nfcPermissionStatus.state === 'granted') {
        console.debug('[NfcService] The user has granted the NFC permission');
        void this.startRead();
      } else if(nfcPermissionStatus.state === 'prompt') {
        console.debug('[NfcService] The user should be asked to grant the NFC permission');
      } else {
        console.debug('[NfcService] The user didn\'t grant the NFC permission');
      }
    } else {
      console.debug('[NfcService] No NFC capability :(');
    }
  }

  async startRead() {
    this.stopWrite();
    this.abortController = new AbortController();
    this.ndef = new NDEFReader();

    try {
      const res = await this.ndef.scan({ signal: this.abortController.signal });

      this.readRunningState$.next('started');

      console.debug('[NfcService] Scan started successfully.', res);

      this.ndef.onreadingerror = () => {
        console.debug('[NfcService] Cannot read data from the NFC tag. Try another one?');
      };

      this.ndef.onreading = (event: NDEFReadingEvent) => {
        console.debug('[NfcService] NDEF message read.', event);
        const decoder = new TextDecoder();
        for(const record of event.message.records) {
          this.messages$.next({
            recordType: record.recordType,
            mediaType: record.mediaType,
            data: decoder.decode(record.data)
          });

        }
      };

    } catch(error) {
      console.error(`[NfcService] Error! Scan failed to start: ${ error }.`);
    }
  }

  stopRead() {
    this.abortController.abort();
    this.readRunningState$.next('stopped');
  }

  async startWrite(text: string) {
    this.stopRead();
    this.abortController = new AbortController();
    this.ndef = new NDEFReader();

    try {
      const res = await this.ndef.write(text, { signal: this.abortController.signal });
      console.debug(`[NfcService] NDEF message "${ text }" written!`, res);
      this.writeRunningState$.next('started');
    } catch(error) {
      this.writeRunningState$.next('stopped');
      console.error(`[NfcService] Error on NDEF message  writing!`, error);
    }
  }

  stopWrite() {
    this.abortController.abort();
    this.writeRunningState$.next('stopped');
  }
}
