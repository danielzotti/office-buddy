import { Component, OnDestroy, OnInit } from '@angular/core';
import { Badge, BadgeForm } from '../../models/badge.models';
import { NfcService } from '../../modules/shared/services/nfc.service';
import { BadgeApiService } from '../../api/badge-api.service';
import { filter, Subject, takeUntil, tap, throttleTime } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../modules/core/services/auth.service';
import { ConfirmDialogService } from '../../modules/shared/components/dialog/confirm-dialog.service';
import { DateService } from '../../modules/shared/services/date.service';
import { UserApiService } from '../../api/user-api.service';
import { AuthUser } from '../../models/auth.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from '../../modules/shared/services/app-loader.service';

@Component({
  selector: 'ob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // AUTH
  user: AuthUser | undefined;

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

  private destroySubject = new Subject<void>();

  constructor(
    private auth: AuthService,
    private nfcService: NfcService,
    private badgeApiService: BadgeApiService,
    private userApiService: UserApiService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private confirmDialog: ConfirmDialogService,
    private appLoaderService: AppLoaderService,
    private snackbar: MatSnackBar
  ) {
  }


  ngOnInit() {

    this.nfcService.init();

    this.nfcService.readRunningState$.pipe(takeUntil(this.destroySubject)).subscribe(async state => {
      this.nfcReadRunningState = state;
    });
    this.nfcService.writeRunningState$.pipe(takeUntil(this.destroySubject)).subscribe(state => {
      this.nfcWriteRunningState = state;
    });
    this.nfcService.permissionState$.pipe(takeUntil(this.destroySubject)).subscribe(state => {
      this.nfcPermissionState = state;
    });
    this.nfcMessages$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(message => {
      this.doBadge(message.data);
    });

    this.auth.user$.pipe(
      filter((user) => !!user),
      tap((user) => {
        const { uid, email, displayName } = user as AuthUser;
        this.user = { uid, email, displayName };
        this.newBadge = {
          ...this.newBadge,
          userId: this.user.uid
        };
      }),
      takeUntil(this.destroySubject)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.nfcService.stopRead();
    this.nfcService.stopWrite();
    this.destroySubject.next();
  }

  badgeIn() {
    this.doBadge('in');
  }

  badgeOut() {
    this.doBadge('out');
  }

  doBadge(clock: BadgeForm['clock']) {
    if(!this.user) {
      alert(`No username to use for badge ${ clock }`);
      return;
    }
    const badge: BadgeForm = {
      userId: this.user.uid,
      clock,
      timestamp: new Date().toISOString()
    };
    this.addBadgeItem(badge);
  }

  async addBadgeItem(badge: BadgeForm) {
    try {
      this.appLoaderService.start();
      await this.badgeApiService.create(badge);
      console.debug('Created', badge);
      this.snackbar.open(`${ badge.clock?.toUpperCase() }: ${ badge.timestamp ? this.dateService.isoToHumanDate(badge.timestamp) : '' }`, 'Dismiss');
    } catch(err) {
      console.error('[Home] error on adding badge item', err);
    }
    this.appLoaderService.stop();
  }

  startNfcScan() {
    void this.nfcService.startRead();
  }

  stopNfcScan() {
    void this.nfcService.stopRead();
  }

  startWriteNfc(clock: Badge['clock']) {
    this.nfcService.startWrite(clock);
  }

  stopWriteNfc() {
    this.nfcService.stopWrite();
    this.nfcService.startRead();

  }

}
