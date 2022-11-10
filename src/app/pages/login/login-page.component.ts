import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../modules/core/services/auth.service';

@Component({
  selector: 'ob-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  isAuthorized$ = this.authService.isAuthorized$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
