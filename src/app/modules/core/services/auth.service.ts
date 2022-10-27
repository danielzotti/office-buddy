import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserApiService } from '../../../api/user-api.service';
import { AuthUser, FirebaseUser } from '../../../models/auth.models';
import { BehaviorSubject, filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private angularFireAuth: AngularFireAuth, private userApiService: UserApiService) {
    this.angularFireAuth.authState.pipe(filter(user => !!user)).subscribe(user => this.retrieveUserInfo(user as FirebaseUser));
  }

  login() {
    this.angularFireAuth.signInWithPopup(new GoogleAuthProvider).then(
      (auth) => {
        console.log('[AuthService login', auth.user);
      },
      (err) => {
        this.resetUserInfo();
        alert(err.message);
      });
  }

  logout() {
    this.angularFireAuth.signOut().then(_ => this.resetUserInfo());
  }

  setUserInfo(user: AuthUser) {
    this.userSubject.next(user);
  }

  resetUserInfo() {
    this.userSubject.next(null);
  }

  retrieveUserInfo(user: FirebaseUser) {
    console.log({ user });
    if(!user?.uid) {
      this.resetUserInfo();
      return;
    }
    const { uid, email, displayName } = user;
    this.setUserInfo({ uid, email, displayName, isAdmin: false, isAuthorized: false });
    this.userApiService.getByKey(user.uid)?.valueChanges().subscribe({
        next: authorizedUser => {
          console.log('[AuthService retrieveUserInfo OK]', { uid, email, displayName, isAdmin: authorizedUser?.isAdmin });
          this.setUserInfo({ uid, email, displayName, isAdmin: authorizedUser?.isAdmin, isAuthorized: true });
        },
        error: error => {
          console.error('[AuthService retrieveUserInfo ERROR]', error);
        }
      }
    );
  }
}
