import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { Badge, BadgeWithKey } from '../models/badge.models';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BadgeApiService {

  private badgesRef: AngularFireList<Badge> = this.db.list<Badge>(environment.firebaseApiUrls.badges, ref => ref.orderByChild('timestamp'));

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  getList(): Observable<BadgeWithKey[]> {
    return this.badgesRef.snapshotChanges().pipe(
      map((changes: SnapshotAction<Badge>[]) =>
        changes.map((c: SnapshotAction<Badge>) => ({ key: c.payload.key, ...c.payload.val() } as BadgeWithKey))
      )
    );
  }

  getByKey(key: BadgeWithKey['key']) {
    throw 'Unsupported method';
  }

  create(badge: Badge) {
    return this.badgesRef.push(badge);
  }

  update(key: BadgeWithKey['key'], badge: Badge) {
    return this.badgesRef.set(key, badge);
  }

  deleteByKey(key: BadgeWithKey["key"]) {
    return this.badgesRef.remove(key);
  }

}
