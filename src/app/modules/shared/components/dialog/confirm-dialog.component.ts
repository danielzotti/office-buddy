import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogOptions } from './confirm-dialog.models';

@Component({
  selector: 'ob-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @HostListener('keydown.esc')
  onEsc() {
    this.close(false);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogOptions,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {
  }


  ngOnInit(): void {
  }

  onCancel() {
    this.close(false);
  }

  onConfirm() {
    this.close(true);
  }

  close(hasConfirmed: boolean) {
    this.dialogRef.close(hasConfirmed);
  }

}
