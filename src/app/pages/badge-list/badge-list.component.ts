import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { BadgeWithKey } from '../../models/badge.models';
import { environment } from '../../../environments/environment';
import {
  BadgeEditDialogComponent
} from '../../modules/core/components/badge-edit-dialog/badge-edit-dialog.component';
import { BadgeApiService } from '../../api/badge-api.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ob-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.scss']
})
export class BadgeListComponent implements OnInit {

  // UI
  isLoading = true;

  //BADGES
  badges$: Observable<BadgeWithKey[]> | undefined;

  constructor(private badgeApiService: BadgeApiService,
              private datePipe: DatePipe,
              private dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.badges$ = this.badgeApiService.getList().pipe(
      tap(_ => this.isLoading = false),
      map((array: BadgeWithKey[]) => array.reverse()),
      catchError((err) => {
        console.debug({ err });
        this.isLoading = false;
        return of([]);
      })
    );

  }

  deleteBadgeItem(badge: BadgeWithKey) {
    const canDelete = confirm(`Are you sure to delete badge by ${ badge.user?.email }
${ badge.clock.toUpperCase() }: ${ this.datePipe.transform(new Date(badge.timestamp), environment.formatter.badgeHumanDateTime) }?`);

    if(canDelete && badge.key) {
      this.badgeApiService.deleteByKey(badge.key).then(res => console.debug('Deleted', badge));
    }
  }


  openUpdateBadgeModal(badge: BadgeWithKey) {
    const dialogRef = this.dialog.open(BadgeEditDialogComponent, {
      width: '350px',
    });

    dialogRef.componentInstance.badge = badge;

    dialogRef.componentInstance.formSubmitted.subscribe(editedBadge => {
      this.badgeApiService.update(badge.key, editedBadge).then(res => console.debug('Updated', editedBadge));
      dialogRef.close();
    });

  }

}
