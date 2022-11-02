import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Badge, BadgeForm, BadgeWithKey } from '../../../../models/badge.models';
import { DateService } from '../../../shared/services/date.service';

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
