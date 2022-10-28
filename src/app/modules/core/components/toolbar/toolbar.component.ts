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

  isAuthenticated$ = this.authService.isAuthenticated$;
  username$ = this.authService.user$.pipe(map(u => u?.email));

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {

  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
