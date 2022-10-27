import { Component, OnInit } from '@angular/core';
import { Badge, BadgeForm, BadgeUser } from '../../models/badge.models';
import { NfcService } from '../../modules/shared/services/nfc.service';
import { BadgeApiService } from '../../api/badge-api.service';
import { filter, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // AUTH
  user: BadgeUser | undefined;

  // NFC
  hasNfcCapability$ = this.nfcService.hasNfcCapability$;
  nfcMessages$ = this.nfcService.messages$;
  nfcPermissionState: PermissionState = 'denied';
  nfcReadRunningState: 'started' | 'stopped' = 'stopped';
  nfcWriteRunningState: 'started' | 'stopped' = 'stopped';
  messages: Array<any> = [];

  // BADGES
  newBadge: BadgeForm = {
    clock: 'in',
    timestamp: this.datePipe.transform(new Date(), environment.formatter.badgeIsoDateTime) ?? undefined
  };

  constructor(
    private auth: AngularFireAuth,
    private nfcService: NfcService,
    private badgeApiService: BadgeApiService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    void this.nfcService.init();

    this.nfcService.readRunningState$.subscribe(state => {
      this.nfcReadRunningState = state;
    });
    this.nfcService.writeRunningState$.subscribe(state => {
      this.nfcWriteRunningState = state;
    });
    this.nfcService.permissionState$.subscribe(state => {
      this.nfcPermissionState = state;
    });
    this.nfcMessages$.subscribe(message => {
      this.doBadge(message.data);
    });

    this.auth.user.pipe(
      filter((user) => !!user),
      tap((user) => {
        const { uid, email, displayName } = user as BadgeUser;
        this.user = { uid, email, displayName };
        this.newBadge = {
          ...this.newBadge,
          user: this.user
        };

      }),
    ).subscribe();
  }

  badgeIn() {
    this.doBadge('in');
  }

  badgeOut() {
    this.doBadge('out');
  }

  doBadge(clock: Badge['clock']) {
    if(!this.user) {
      alert(`No username to use for badge ${ clock }`);
      return;
    }
    const badge: Badge = {
      user: this.user,
      clock,
      timestamp: new Date().toISOString()
    };
    // this.badgesRef.push(badge);
    this.addBadgeItem(badge);
  }

  addBadgeItem(badge: Badge) {
    this.badgeApiService.create(badge).then(res => console.log('Updated', badge));
  }

  startNfcScan() {
    void this.nfcService.startRead();
  }

  stopNfcScan() {
    void this.nfcService.stopRead();
  }

  startWriteNfc(clock: Badge['clock']) {
    void this.nfcService.startWrite(clock);
  }

  stopWriteNfc() {
    void this.nfcService.stopWrite();
  }

}