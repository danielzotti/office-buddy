import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { ConfirmDialogOptions } from './confirm-dialog.models';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  public dialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  constructor(private dialog: MatDialog) {
  }

  public open(options: ConfirmDialogOptions) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText,
      }
    });
  }

  public confirmed(): Observable<boolean> {
    if(!this.dialogRef) {
      return of(false);
    }

    return this.dialogRef.afterClosed().pipe(
      take(1),
      map(res => res));
  }
}
