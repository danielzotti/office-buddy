import { Component, OnInit } from '@angular/core';
import { catchError, filter, map, Observable, of, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Badge, BadgeForm, BadgeWithKey } from './models/badge.models';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BadgeEditDialogComponent } from './modules/shared/components/badge-edit-dialog/badge-edit-dialog.component';
import { NfcService } from './modules/shared/services/nfc.service';
import { User } from './models/user.models';
import { AppCheckUpdateService } from './modules/shared/services/app-check-update.service';
import { environment } from '../environments/environment';
import { BadgeApiService } from './api/badge-api.service';
import { UserApiService } from './api/user-api.service';

@Component({
  selector: 'ob-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // AUTH
  user: User | undefined;
  isUserAuthorized = false;

  //BADGES
  badges$: Observable<BadgeWithKey[]> | undefined;
  newBadge: BadgeForm = {
    clock: 'in',
    timestamp: this.datePipe.transform(new Date(), environment.formatter.badgeIsoDateTime) ?? undefined
  };

  // NFC
  hasNfcCapability$ = this.nfcService.hasNfcCapability$;
  nfcMessages$ = this.nfcService.messages$;
  nfcPermissionState: PermissionState = 'denied';
  nfcReadRunningState: 'started' | 'stopped' = 'stopped';
  nfcWriteRunningState: 'started' | 'stopped' = 'stopped';
  messages: Array<any> = [];

  // UI
  isLoading = true;

  constructor(public auth: AngularFireAuth,
              private datePipe: DatePipe,
              private dialog: MatDialog,
              private badgeApiService: BadgeApiService,
              private authUserApiService: UserApiService,
              public nfcService: NfcService,
              private appCheckUpdateService: AppCheckUpdateService
  ) {

  }

  ngOnInit() {

    // Check if app has an update
    this.appCheckUpdateService.init();

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
      filter(user => !user?.uid),
      tap(_ => {
        this.isUserAuthorized = false;
        this.user = undefined;
      })
    ).subscribe(_ => {
      console.log('User logged out');
    });

    this.auth.user.pipe(
      filter((user, index) => !!user),
      tap((user) => {
        this.isUserAuthorized = true;
        const { uid, email, displayName } = user as User;
        this.user = { uid, email, displayName };
        this.newBadge = {
          ...this.newBadge,
          user: this.user
        };

        this.badges$ = this.badgeApiService.getList().pipe(
          tap(console.debug),
          tap(_ => this.isLoading = false),
          map((array: BadgeWithKey[]) => array.reverse()),
          catchError((err) => {
            console.log({ err });
            this.isLoading = false;
            if(err.code === 'PERMISSION_DENIED') {
              this.isUserAuthorized = false;
            }
            return of([]);
          })
        );
        this.authUserApiService.getList().subscribe(users => console.log({ users }));
      }),
    ).subscribe();
  }

  addBadgeItem(badge: Badge) {
    this.badgeApiService.create(badge).then(res => console.log('Updated', badge));
  }

  deleteBadgeItem(badge: BadgeWithKey) {
    const canDelete = confirm(`Are you sure to delete badge by ${ badge.user?.email }
${ badge.clock.toUpperCase() }: ${ this.datePipe.transform(new Date(badge.timestamp), environment.formatter.badgeHumanDateTime) }?`);

    if(canDelete && badge.key) {
      this.badgeApiService.deleteByKey(badge.key).then(res => console.log('Deleted', badge));
    }
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

  openUpdateBadgeModal(badge: BadgeWithKey) {
    const dialogRef = this.dialog.open(BadgeEditDialogComponent, {
      width: '350px',
    });

    dialogRef.componentInstance.badge = badge;

    dialogRef.componentInstance.formSubmitted.subscribe(editedBadge => {
      // this.badgesRef.set(badge.key, editedBadge).then(res => console.log('Updated', editedBadge));
      this.badgeApiService.update(badge.key, editedBadge).then(res => console.log('Updated', editedBadge));
      dialogRef.close();
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
