import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MaterialModule } from '../material/material.module';
import { BadgeFormComponent } from './components/badge-form/badge-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BadgeEditDialogComponent } from './components/badge-edit-dialog/badge-edit-dialog.component';

const components = [
  SpinnerComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...components,
    BadgeFormComponent,
    BadgeEditDialogComponent
  ],
  exports: [
    ...components,
    BadgeFormComponent
  ]
})
export class SharedModule {
}
