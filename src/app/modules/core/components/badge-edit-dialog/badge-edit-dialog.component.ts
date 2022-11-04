import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BadgeForm } from '../../../../models/badge.models';

@Component({
  selector: 'ob-badge-edit-dialog',
  templateUrl: './badge-edit-dialog.component.html',
  styleUrls: ['./badge-edit-dialog.component.scss']
})
export class BadgeEditDialogComponent implements OnInit {

  @Input()
  badgeForm: BadgeForm | undefined;

  @Output()
  formSubmitted = new EventEmitter<BadgeForm>();

  constructor() {
  }

  ngOnInit(): void {

  }

}
