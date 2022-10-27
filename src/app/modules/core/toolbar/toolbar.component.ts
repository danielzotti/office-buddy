import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'ob-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  version = environment.appVersion;

  username: string | null | undefined;

  constructor(private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.auth.user.subscribe(user => this.username = user?.email);
  }

  login() {
    this.auth.signInWithPopup(new GoogleAuthProvider).then(
      console.debug,
      (err) => alert(err.message));
  }

  logout() {
    this.auth.signOut().then(console.log);
  }
}
