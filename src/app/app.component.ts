import { Component, OnInit } from '@angular/core';
import { AppCheckUpdateService } from './modules/shared/services/app-check-update.service';
import { AuthService } from './modules/core/services/auth.service';
import { AppLoaderService } from './modules/shared/services/app-loader.service';

@Component({
  selector: 'ob-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthorized$ = this.authService.isAuthorized$;
  isAuthenticated$ = this.authService.isAuthenticated$;
  isAppLoading$ = this.appLoaderService.isLoading$;

  constructor(private authService: AuthService,
              private appCheckUpdateService: AppCheckUpdateService,
              private appLoaderService: AppLoaderService
  ) {

  }

  ngOnInit() {
    // Check if app has an update
    this.appCheckUpdateService.init();
  }

}
