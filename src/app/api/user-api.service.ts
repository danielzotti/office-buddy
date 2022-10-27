import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { environment } from '../../environments/environment';
import { map, Observable, of } from 'rxjs';
import { User, UserWithKey } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private usersRef: AngularFireList<User> = this.db.list<User>(environment.firebaseApiUrls.users, ref => ref.orderByChild('email'));

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  getList(): Observable<User[]> {
    return this.usersRef.snapshotChanges().pipe(
      map((changes: SnapshotAction<User>[]) =>
        changes.map((c: SnapshotAction<User>) => ({ key: c.payload.key, ...c.payload.val() } as UserWithKey))
      )
    );
  }

  getByKey(key: UserWithKey['key']) {
    if(!key) {
      return;
    }
    return this.db.object<User>(`${ environment.firebaseApiUrls.users }/${ key }`);
  }

  create(user: User) {
    return this.usersRef.push(user);
  }

  update(key: UserWithKey['key'], user: User) {
    return this.usersRef.set(key, user);
  }

  deleteByKey(key: UserWithKey['key']) {
    return this.usersRef.remove(key);
  }

}
