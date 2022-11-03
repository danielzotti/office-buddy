import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DbUser, User, UserWithKey } from '../models/user.models';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirebaseHelperService } from '../modules/shared/services/firebase-helper.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private users: AngularFirestoreCollection<DbUser> = this.db.collection<DbUser>(environment.firebaseApiUrls.users);

  constructor(private db: AngularFirestore, private firebaseHelper: FirebaseHelperService) {
  }

  ngOnInit() {
  }

  getList() {
    return this.firebaseHelper.collectionWithKey<DbUser>(this.users).pipe(
      map(list => list.filter(item => !!item) as DbUser[])
    );
  }

  getByKey(key: UserWithKey['key']) {
    return this.firebaseHelper.docWithKey<User>(this.db.doc<User>(`${ environment.firebaseApiUrls.users }/${ key }`));
  }

  create(user: User) {
    return this.users.add(user);
  }

  update(key: UserWithKey['key'], user: Partial<User>) {
    return this.users.doc(key).update(user);
  }

  deleteByKey(key: UserWithKey['key']) {
    return this.users.doc(key).delete();
  }

}
