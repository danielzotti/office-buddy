import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { AuthUser, AuthUserWithKey } from '../models/auth-user.models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private usersRef: AngularFireList<AuthUser> = this.db.list<AuthUser>(environment.firebaseApiUrls.users, ref => ref.orderByChild('email'));

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  getList(): Observable<AuthUser[]> {
    return this.usersRef.snapshotChanges().pipe(
      map((changes: SnapshotAction<AuthUser>[]) =>
        changes.map((c: SnapshotAction<AuthUser>) => ({ key: c.payload.key, ...c.payload.val() } as AuthUserWithKey))
      )
    );
  }

  getByKey(key: AuthUserWithKey['key']) {
    throw 'Unsupported method';
  }

  create(user: AuthUser) {
    return this.usersRef.push(user);
  }

  update(key: AuthUserWithKey['key'], user: AuthUser) {
    return this.usersRef.set(key, user);
  }

  deleteByKey(key: AuthUserWithKey['key']) {
    return this.usersRef.remove(key);
  }

}
