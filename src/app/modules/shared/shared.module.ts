import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/dialog/confirm-dialog.component';
import { ConfirmDialogService } from './components/dialog/confirm-dialog.service';

const components = [
  SpinnerComponent,
  ConfirmDialogComponent
];

const services = [
  ConfirmDialogService,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...components,
  ],
  providers: [
    ...services
  ],
  exports: [
    ...components,
  ]
})
export class SharedModule {
}
