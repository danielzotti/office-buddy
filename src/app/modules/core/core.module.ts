import { NgModule } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../material/material.module';
import { LoginWithGoogleComponent } from './components/login-with-google/login-with-google.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AdminOnlyDirective } from './directives/admin-only.directive';
import { AuthorizedOnlyDirective } from './directives/authorized-only.directive';

const directives = [
  AdminOnlyDirective,
  AuthorizedOnlyDirective,
];

const components = [
  LoginWithGoogleComponent,
  ToolbarComponent,
];

@NgModule({
  declarations: [
    ...components,
    ...directives
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AngularFireAuthModule,
    RouterLinkWithHref,
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    MaterialModule,
    ...components,
    ...directives
  ]
})
export class CoreModule {
}
