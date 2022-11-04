import { Component, OnInit } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  BadgeEditDialogComponent
} from '../../modules/core/components/badge-edit-dialog/badge-edit-dialog.component';
import { BadgeApiService } from '../../api/badge-api.service';
import { MatDialog } from '@angular/material/dialog';
import { DateService } from '../../modules/shared/services/date.service';
import { AuthService } from '../../modules/core/services/auth.service';
import { Badge } from '../../models/badge.models';

@Component({
  selector: 'ob-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.scss']
})
export class BadgeListComponent implements OnInit {

  // UI
  isLoading = true;

  // BADGES
  badges$: Observable<Badge[]> | undefined;

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
      /* switchMap(() => this.badgeApiService.getCollection().pipe(
           tap(_ => this.isLoading = false),
           catchError((err) => {
             console.error({ err });
             this.isLoading = false;
             return of([]);
           })
         )
       )*/
    );
  }

  deleteBadgeItem(badge: Badge) {
    const canDelete = confirm(`Are you sure to delete badge by ${ badge.user?.email }
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
      userId: badge.user?.key,
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
