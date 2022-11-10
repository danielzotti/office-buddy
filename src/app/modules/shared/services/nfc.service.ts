import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  tap,
  throttleTime
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private ndef: NDEFReader | undefined;
  private abortController = new AbortController();

  private hasNfcCapabilitySubject = new BehaviorSubject<boolean>(false);
  private permissionStateSubject = new BehaviorSubject<PermissionState>('denied');
  private readRunningStateSubject = new BehaviorSubject<'started' | 'stopped'>('stopped');
  private writeRunningStateSubject = new BehaviorSubject<'started' | 'stopped'>('stopped');
  private messagesSubject = new Subject<any>();

  public hasNfcCapability$ = this.hasNfcCapabilitySubject.asObservable();
  public permissionState$ = this.permissionStateSubject.asObservable();
  public readRunningState$ = this.readRunningStateSubject.asObservable();
  public writeRunningState$ = this.writeRunningStateSubject.asObservable();

  public messages$ = this.messagesSubject.asObservable().pipe(
    throttleTime(500),
  );

  constructor(private snackbar: MatSnackBar) {
  }

  async init() {

    if('NDEFReader' in window) {
      console.debug('[NfcService] This browser has NFC capability! <3');

      this.hasNfcCapabilitySubject.next(true);

      const nfcPermissionStatus = await navigator.permissions.query({ name: 'nfc' } as unknown as PermissionDescriptor);

      this.permissionStateSubject.next(nfcPermissionStatus.state);

      nfcPermissionStatus.onchange = () => {
        console.debug('[NfcService] The user decided to change his settings. New permission: ' + nfcPermissionStatus.state);
        this.permissionStateSubject.next(nfcPermissionStatus.state);
        if(nfcPermissionStatus.state === 'denied') {
          this.stopRead();
        }
      };

      if(nfcPermissionStatus.state === 'granted') {
        console.debug('[NfcService] The user has granted the NFC permission');
        if(this.readRunningStateSubject.value !== 'started') {
          void this.startRead();
        }
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

      this.readRunningStateSubject.next('started');

      console.debug('[NfcService] Scan started successfully.', res);

      this.ndef.onreadingerror = () => {
        console.debug('[NfcService] Cannot read data from the NFC tag. Try another one?');
      };

      this.ndef.onreading = (event: NDEFReadingEvent) => {
        console.debug('[NfcService] NDEF message read.', event);
        const decoder = new TextDecoder();
        for(const record of event.message.records) {
          this.messagesSubject.next({
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
    this.readRunningStateSubject.next('stopped');
  }

  startWrite(text?: string) {
    if(!text) {
      console.error('[NfcService] cannot write an empty text');
      return;
    }
    this.stopRead();
    this.abortController = new AbortController();
    this.ndef = new NDEFReader();
    this.writeRunningStateSubject.next('started');
    this.ndef.write(text, { signal: this.abortController.signal })
      .then(res => {
        this.writeRunningStateSubject.next('stopped');
        console.debug(`[NfcService] NDEF message "${ text }" written!`, res);
        this.snackbar.open(`NDEF message "${ text }" written`, 'Dismiss');
        setTimeout(() => void this.startRead(), 2000);
      })
      .catch(err => {
        this.writeRunningStateSubject.next('stopped');
        if(err.toString().startsWith('AbortError')) {
          console.debug(`[NfcService] Stop writing NDEF message`);
        } else {
          console.error(`[NfcService] Error on NDEF message  writing!`, err);
        }
      });
  }

  stopWrite() {
    this.abortController.abort();
    this.writeRunningStateSubject.next('stopped');
  }
}
