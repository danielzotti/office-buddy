import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { AuthUser } from '../../../../models/auth.models';

@Component({
  selector: 'ob-login-with-google',
  templateUrl: './login-with-google.component.html',
  styleUrls: ['./login-with-google.component.scss']
})
export class LoginWithGoogleComponent implements OnInit {
  @Input()
  color: ThemePalette;

  user$: Observable<AuthUser | null> = this.authService.user$;

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
