import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserApiService } from '../../../api/user-api.service';
import { AuthUser, FirebaseUser } from '../../../models/auth.models';
import {
  BehaviorSubject,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  share,
  tap
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  public user$ = this.userSubject.asObservable();

  public isAdmin$ = this.user$.pipe(
    map(u => !!u?.isAdmin),
    distinctUntilChanged(),
  );
  public isAuthorized$ = this.user$.pipe(
    map(u => !!u?.isAuthorized),
    distinctUntilChanged(),
  );
  public isAuthenticated$ = this.user$.pipe(
    map(u => !!u),
    distinctUntilChanged(),
  );

  constructor(
    private angularFireAuth: AngularFireAuth,
    private userApiService: UserApiService,
    private router: Router,
  ) {
    this.angularFireAuth.authState.pipe(filter(user => !!user)).subscribe(user => this.retrieveUserInfo(user as FirebaseUser));
  }

  login() {
    this.angularFireAuth.signInWithPopup(new GoogleAuthProvider).then(
      (auth) => {
        console.debug('[AuthService login', auth.user);
      },
      (err) => {
        this.resetUserInfo();
        alert(err.message);
      });
  }

  logout() {
    this.angularFireAuth.signOut().then(_ => {
      this.router.navigate(['login']);
      this.resetUserInfo();
    });
  }

  setUserInfo(user: AuthUser) {
    this.userSubject.next(user);
  }

  resetUserInfo() {
    this.userSubject.next(null);
  }

  retrieveUserInfo(user: FirebaseUser) {
    if(!user?.uid) {
      this.resetUserInfo();
      return;
    }
    const { uid, email, displayName } = user;
    const userInfoBase = { uid, email, displayName, isAdmin: false, isAuthorized: false };
    this.setUserInfo(userInfoBase);
    this.userApiService.getByKey(user.uid).subscribe({
        next: authorizedUser => {
          console.debug('[AuthService retrieveUserInfo OK]', { ...userInfoBase, isAdmin: authorizedUser?.isAdmin });
          this.setUserInfo({ ...userInfoBase, isAdmin: authorizedUser?.isAdmin, isAuthorized: !!authorizedUser });
          this.router.navigate(['home']);
        },
        error: error => {
          console.error('[AuthService retrieveUserInfo ERROR]', error);
        }
      }
    );
  }
}
