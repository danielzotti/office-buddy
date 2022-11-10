import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NfcService } from './modules/shared/services/nfc.service';
import { AppCheckUpdateService } from './modules/shared/services/app-check-update.service';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { BadgeListPageComponent } from './pages/badge-list/badge-list-page.component';
import { UserListPageComponent } from './pages/user-list/user-list-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BadgeModule } from './modules/badge/badge.module';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BadgeListPageComponent,
    UserListPageComponent,
    NotFoundPageComponent,
    LoginPageComponent
  ],
  imports: [
    // ANGULAR
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // SERVICE WORKER
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // FIREBASE
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    // CUSTOM
    CoreModule,
    SharedModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLinkWithHref,
    BadgeModule,
  ],
  providers: [
    AppCheckUpdateService,
    DatePipe,
    NfcService,
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
