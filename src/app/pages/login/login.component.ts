import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../modules/core/services/auth.service';

@Component({
  selector: 'ob-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isAuthorized$ = this.authService.isAuthorized$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
