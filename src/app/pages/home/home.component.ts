import { Component, OnInit } from '@angular/core';
import { Badge, BadgeForm, BadgeUser } from '../../models/badge.models';
import { NfcService } from '../../modules/shared/services/nfc.service';
import { BadgeApiService } from '../../api/badge-api.service';
import { filter, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../modules/core/services/auth.service';
import { ConfirmDialogService } from '../../modules/shared/components/dialog/confirm-dialog.service';
import { DateService } from '../../modules/shared/services/date.service';
import { GoogleSpreadsheetApiService } from '../../api/google-spreadsheet-api.service';

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
    private auth: AuthService,
    private nfcService: NfcService,
    private badgeApiService: BadgeApiService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private confirmDialog: ConfirmDialogService,
    private sheetService: GoogleSpreadsheetApiService,
  ) {
  }

  ngOnInit(): void {

    this.sheetService.get({
      spreadsheetId: '1Zgjl_ixcBFuyzbuaCZqeLBKXoDGwlhXvFcGtgzN8GPE',
      range: 'badges'
    }).subscribe(res => console.log({ badges: res }));


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

    this.auth.user$.pipe(
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
    this.badgeApiService.create(badge).then(() => {
      console.debug('Updated', badge);
      this.confirmDialog.open({
        html: `<div><label>Email:</label> ${ badge.user.email }</div>
<div><label>Clock:</label> ${ badge.clock }</div>
<div><label>Time:</label> ${ this.dateService.isoToHumanDate(badge.timestamp) }</div>`,
        confirmText: 'Ok',
        title: 'Badge sent',
      });
    });
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
