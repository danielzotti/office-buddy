import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Badge, BadgeForm, BadgeWithKey } from '../../../../models/badge.models';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'ob-badge-form',
  templateUrl: './badge-form.component.html',
  styleUrls: ['./badge-form.component.scss']
})
export class BadgeFormComponent implements OnInit, OnChanges {

  @Input()
  badge: BadgeForm | undefined = {
    clock: 'in',
    timestamp: this.dateService.jsToHtmlDate(new Date())
  };

  @Output()
  formSubmitted = new EventEmitter<Badge>();

  badgeForm: FormGroup = new FormGroup({
    username: new FormControl(this.badge?.username),
    clock: new FormControl(this.badge?.clock),
    timestamp: new FormControl(this.badge?.timestamp),
  });

  constructor(private dateService: DateService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.['badge']?.currentValue)
      this.badgeForm.patchValue({
        ...changes?.['badge']?.currentValue
      });
  }

  submit() {
    if(this.badgeForm.invalid) {
      return;
    }
    const badge: Badge = {
      ...this.badgeForm.value,
      timestamp: this.dateService.htmlToIso(this.badgeForm.value.timestamp)
    };
    this.formSubmitted.emit(badge);
  }
}
