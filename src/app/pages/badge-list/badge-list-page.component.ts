import { Component, OnInit } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  BadgeEditDialogComponent
} from '../../modules/badge/badge-edit-dialog/badge-edit-dialog.component';
import { BadgeApiService } from '../../api/badge-api.service';
import { MatDialog } from '@angular/material/dialog';
import { DateService } from '../../modules/shared/services/date.service';
import { AuthService } from '../../modules/core/services/auth.service';
import { Badge } from '../../models/badge.models';

@Component({
  selector: 'ob-badge-list-page',
  templateUrl: './badge-list-page.component.html',
  styleUrls: ['./badge-list-page.component.scss']
})
export class BadgeListPageComponent implements OnInit {

  // UI
  isLoading = true;

  // BADGES
  badges$: Observable<Badge[]> | undefined;

  private destroySubject = new Subject<void>();

  constructor(private badgeApiService: BadgeApiService,
              private dateService: DateService,
              private auth: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.badges$ = this.auth.userId$.pipe(
      distinctUntilChanged(),
      filter(uid => !!uid),
      switchMap((userId) => this.badgeApiService.getCollectionByUserId(userId!).pipe(
          tap(_ => this.isLoading = false),
          catchError((err) => {
            console.error({ err });
            this.isLoading = false;
            return of([]);
          })
        )
      ),
      takeUntil(this.destroySubject)
    );
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
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

}
