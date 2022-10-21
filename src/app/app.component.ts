import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { catchError, distinctUntilChanged, map, Observable, of, Subscription, takeUntil, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Badge, BadgeForm, BadgeWithKey } from './models/badge.models';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BadgeEditDialogComponent } from './modules/shared/components/badge-edit-dialog/badge-edit-dialog.component';
import { NfcService } from './modules/shared/services/nfc.service';

@Component({
  selector: 'ob-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // AUTH
  username: string | undefined;

  isUserAuthorized = false;

  //BADGES
  badgesRef: AngularFireList<Badge> = this.db.list<Badge>('/badge', ref => ref.orderByChild('timestamp'));
  badges$: Observable<BadgeWithKey[]> = of([]);
  newBadge: BadgeForm = {
    clock: 'in',
    timestamp: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm') ?? undefined
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
              private db: AngularFireDatabase,
              private datePipe: DatePipe,
              private dialog: MatDialog,
              public nfcService: NfcService,
  ) {

  }

  ngOnInit() {

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

    this.auth.user.subscribe(user => {
      this.isUserAuthorized = true;
      this.username = user?.email || undefined;
      this.newBadge = {
        ...this.newBadge,
        username: this.username
      };
    });

    this.badges$ = this.badgesRef.snapshotChanges().pipe(
      map((changes: SnapshotAction<Badge>[]) =>
        changes.map((c: SnapshotAction<Badge>) => ({ key: c.payload.key, ...c.payload.val() } as BadgeWithKey))
      ),
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
  }

  addBadgeItem(badge: Badge) {
    this.badgesRef.push(badge);
  }

  deleteBadgeItem(badge: BadgeWithKey) {
    const canDelete = confirm(`Are you sure to delete badge by ${ badge.username }
${ badge.clock.toUpperCase() }: ${ this.datePipe.transform(new Date(badge.timestamp), 'dd/MM/yyyy HH:mm') }?`);

    if(canDelete && badge.key) {
      this.badgesRef.remove(badge.key).then(res => console.log('Deleted', badge));
    }
  }

  badgeIn() {
    this.doBadge('in');
  }

  badgeOut() {
    this.doBadge('out');
  }

  doBadge(clock: Badge['clock']) {
    if(!this.username) {
      console.log(`No username to badge for badge ${ clock }`);
      return;
    }
    const badge: Badge = {
      username: this.username,
      clock,
      timestamp: new Date().toISOString()
    };
    this.badgesRef.push(badge);
  }

  openUpdateBadgeModal(badge: BadgeWithKey) {
    const dialogRef = this.dialog.open(BadgeEditDialogComponent, {
      width: '350px',
    });

    dialogRef.componentInstance.badge = badge;

    dialogRef.componentInstance.formSubmitted.subscribe(editedBadge => {
      this.badgesRef.set(badge.key, editedBadge).then(res => console.log('Updated', editedBadge));
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
