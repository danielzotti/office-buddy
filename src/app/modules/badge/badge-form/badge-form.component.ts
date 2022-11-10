import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BadgeForm } from '../../../models/badge.models';
import { DateService } from '../../shared/services/date.service';

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
  formSubmitted = new EventEmitter<BadgeForm>();

  badgeForm: FormGroup = new FormGroup({
    clock: new FormControl(this.badge?.clock),
    timestamp: new FormControl(this.badge?.timestamp),
    userId: new FormControl({
      value: this.badge?.userId,
      disabled: true
    })
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
    const badge: BadgeForm = {
      ...this.badgeForm.getRawValue(),
      timestamp: this.dateService.htmlToIso(this.badgeForm.value.timestamp)
    };
    this.formSubmitted.emit(badge);
  }
}
