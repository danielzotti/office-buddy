import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'ob-login-with-google',
  templateUrl: './login-with-google.component.html',
  styleUrls: ['./login-with-google.component.scss']
})
export class LoginWithGoogleComponent implements OnInit {
  @Input()
  color: ThemePalette;

  constructor(public auth: AngularFireAuth) {
  }

  ngOnInit(): void {
  }

  login() {
    this.auth.signInWithPopup(new GoogleAuthProvider).then(
      console.log,
      (err) => alert(err.message));
  }

  logout() {
    this.auth.signOut().then(console.log);
  }
}
