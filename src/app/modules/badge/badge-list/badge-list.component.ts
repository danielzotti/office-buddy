import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Badge } from '../../../models/badge.models';

@Component({
  selector: 'ob-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.scss']
})
export class BadgeListComponent implements OnInit {

  @Input()
  badges: Array<Badge> = [];

  @Output()
  deleteBadge = new EventEmitter<Badge>();

  @Output()
  updateBadge = new EventEmitter<Badge>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onDeleteBadgeItem(badge: Badge) {
    this.deleteBadge.emit(badge);
  }

  onUpdateBadgeItem(badge: Badge) {
    this.updateBadge.emit(badge);
  }
}
