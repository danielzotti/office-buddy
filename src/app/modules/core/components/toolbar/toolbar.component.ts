import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'ob-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  version = environment.appVersion;
  username: string | undefined | null;
  isAuthorized = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.username = user?.email;
      this.isAuthorized = !!user?.isAuthorized;
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
