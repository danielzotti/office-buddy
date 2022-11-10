import { DateTime } from 'luxon';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Badge, BadgeForm } from '../../models/badge.models';
import { NfcService } from '../../modules/shared/services/nfc.service';
import { BadgeApiService } from '../../api/badge-api.service';
import {
  catchError,
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../modules/core/services/auth.service';
import { ConfirmDialogService } from '../../modules/shared/components/dialog/confirm-dialog.service';
import { DateService } from '../../modules/shared/services/date.service';
import { UserApiService } from '../../api/user-api.service';
import { AuthUser } from '../../models/auth.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from '../../modules/shared/services/app-loader.service';
import { BadgeEditDialogComponent } from '../../modules/badge/badge-edit-dialog/badge-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ob-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
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
  todayBadges$: Observable<Array<Badge>> | undefined;
  newBadge: BadgeForm = {
    clock: 'in',
    timestamp: this.datePipe.transform(new Date(), environment.formatter.badgeIsoDateTime) ?? undefined
  };
  isTodayLoading = false;
  todayBadges: Array<Badge> = [];


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
    private snackbar: MatSnackBar,
    private dialog: MatDialog
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

    this.isTodayLoading = true;

    this.todayBadges$ = this.auth.userId$.pipe(
      // distinctUntilChanged(),
      filter(uid => !!uid),
      switchMap((userId) => this.badgeApiService.getTodayByUserId(userId!).pipe(
          tap(_ => this.isTodayLoading = false),
          tap(badges => this.todayBadges = badges),
          catchError((err) => {
            console.error({ err });
            return of([]);
          })
        )
      ),
      takeUntil(this.destroySubject)
    );
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
    this.appLoaderService.start();

    if(this.isTodayBadgeAlreadyExisting(badge)) {
      this.snackbar.open(`Badge already exists!`, 'Dismiss');
      this.appLoaderService.stop();
      return;
    }

    try {
      await this.badgeApiService.create(badge);
      console.debug('Created', badge);
      this.snackbar.open(`${ badge.clock?.toUpperCase() }: ${ badge.timestamp ? this.dateService.isoToHumanDate(badge.timestamp) : '' }`, 'Dismiss');
    } catch(err) {
      console.error('[Home] error on adding badge item', err);
    }
    this.appLoaderService.stop();
  }

  deleteBadgeItem(badge: Badge) {
    const canDelete = confirm(`Are you sure to delete badge
${ badge.clock?.toUpperCase() }: ${ this.dateService.isoToHumanDate(badge.timestamp) }?`);

    if(canDelete && badge.key) {
      this.badgeApiService.deleteByKey(badge.key).then(res => console.debug('Deleted', badge));
    }
  }

  openUpdateBadgeModal(badge: Badge) {
    const dialogRef = this.dialog.open(BadgeEditDialogComponent, {
      width: '350px',
    });

    dialogRef.componentInstance.badgeForm = {
      userId: badge.userId,
      clock: badge.clock,
      timestamp: this.dateService.isoToHtmlDate(badge?.timestamp)
    };

    dialogRef.componentInstance.formSubmitted.subscribe(editedBadge => {
      this.badgeApiService.update(badge.key, {
        ...editedBadge,
        timestamp: editedBadge.timestamp
      }).then(res => console.debug('Updated', editedBadge));
      dialogRef.close();
    });

  }


  // NFC
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

  private isTodayBadgeAlreadyExisting(badge: BadgeForm) {
    const todayBadge = this.todayBadges.find(b => {
      const t1 = DateTime.fromISO(badge.timestamp!).toFormat('yyyy-MM-dd hh:mm');
      const t2 = DateTime.fromISO(b.timestamp).toFormat('yyyy-MM-dd hh:mm');
      return t1 === t2 && b.clock === badge.clock;
    });
    return !!todayBadge;
  }

}
