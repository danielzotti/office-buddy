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
import { HomeComponent } from './pages/home/home.component';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { BadgeListComponent } from './pages/badge-list/badge-list.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { GoogleSpreadsheetApiService } from './api/google-spreadsheet-api.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BadgeListComponent,
    UserListComponent,
    NotFoundComponent,
    LoginComponent
  ],
  imports: [
    // ANGULAR
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    // CUSTOM
    CoreModule,
    SharedModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLinkWithHref,
  ],
  providers: [
    AppCheckUpdateService,
    DatePipe,
    NfcService,
    ScreenTrackingService,
    UserTrackingService,
    GoogleSpreadsheetApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
