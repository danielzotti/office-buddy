import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Badge, BadgeForm, BadgeWithKey } from '../../../../models/badge.models';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'ob-badge-edit-dialog',
  templateUrl: './badge-edit-dialog.component.html',
  styleUrls: ['./badge-edit-dialog.component.scss']
})
export class BadgeEditDialogComponent implements OnInit {

  @Input()
  badge: BadgeWithKey | undefined;

  badgeForm: BadgeForm | undefined;

  @Output()
  formSubmitted = new EventEmitter<Badge>();

  constructor(private dateService: DateService) {
  }

  ngOnInit(): void {
    this.badgeForm = {
      ...this.badge,
      timestamp: this.dateService.isoToHtmlDate(this.badge?.timestamp)
    };
  }

}
