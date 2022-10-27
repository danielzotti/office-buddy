import { Component, OnInit } from '@angular/core';
import { AppCheckUpdateService } from './modules/shared/services/app-check-update.service';
import { AuthService } from './modules/core/services/auth.service';
import { AuthUser } from './models/auth.models';

@Component({
  selector: 'ob-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // AUTH
  isUserAuthorized = false;
  user: AuthUser | null = null;

  constructor(public authService: AuthService,
              private appCheckUpdateService: AppCheckUpdateService
  ) {

  }

  ngOnInit() {
    // Check if app has an update
    this.appCheckUpdateService.init();

    // Check if user is authorized
    this.authService.user$.subscribe(user => {
      console.warn(user)
      this.isUserAuthorized = !!user?.isAuthorized;
      this.user = user;
    });

  }

}
