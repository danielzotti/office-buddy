import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from '../material/material.module';
import { LoginWithGoogleComponent } from './login-with-google/login-with-google.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ToolbarComponent,
    LoginWithGoogleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AngularFireAuthModule
  ],
  exports: [
    MaterialModule,
    ToolbarComponent,
    LoginWithGoogleComponent
  ]
})
export class CoreModule {
}
