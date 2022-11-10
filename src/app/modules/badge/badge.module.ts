import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeListComponent } from './badge-list/badge-list.component';
import { BadgeFormComponent } from './badge-form/badge-form.component';
import { BadgeEditDialogComponent } from './badge-edit-dialog/badge-edit-dialog.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [
  BadgeListComponent,
  BadgeFormComponent,
  BadgeEditDialogComponent,
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    ...components,
  ]
})
export class BadgeModule {
}
