import { Injectable } from '@angular/core';
import {
  BadgeForm,
  BadgeWithKey,
  DbBadge, DbBadgeUser,
  DbBadgeWithKey,
} from '../models/badge.models';
import { combineLatest, distinctUntilChanged, map, Observable, of, startWith, switchMap, withLatestFrom } from 'rxjs';
import { DocumentReference, getDoc, Timestamp } from '@angular/fire/firestore';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { DateService } from '../modules/shared/services/date.service';

@Injectable({
  providedIn: 'root'
})
export class BadgeApiService {

  private collection: AngularFirestoreCollection<DbBadge>;

  constructor(private db: AngularFirestore, private dateService: DateService) {
    this.collection = db.collection<DbBadge>('badges');
  }

  ngOnInit() {
  }

  getCollection(): Observable<BadgeWithKey[]> {
    return this.collection.snapshotChanges().pipe(
      distinctUntilChanged(),
      map((changes) =>
        changes.map((c) => ({ key: c.payload.doc.id, ...c.payload.doc.data() }) as DbBadgeWithKey)
      ),
      switchMap((badges) => {
          if(!badges.length) {
            return of([]);
          }
          return combineLatest(
            badges.map(async badge => {
              if(!badge.user) {
                return {
                  ...badge,
                  timestamp: (badge.timestamp as Timestamp)?.toDate().toISOString(),
                } as BadgeWithKey;
              }

              const userRef = await getDoc<DbBadgeUser>(badge.user as DocumentReference<DbBadgeUser>);
              const user = userRef.data();
              return {
                ...badge,
                timestamp: (badge.timestamp as Timestamp)?.toDate().toISOString(),
                user: {
                  uid: userRef.id,
                  ...user
                }
              } as BadgeWithKey;
            })
          );
        }
      )
    );
  }

  async create(badge: BadgeForm) {
    if(!badge?.userId) {
      return;
    }

    const userRef = this.db.doc<DbBadgeUser>(`users/${ badge.userId }`).ref;
    return this.collection.add({
      clock: badge.clock,
      timestamp: this.dateService.isoToJsDate(badge.timestamp) ?? new Date(),
      user: userRef as unknown as DbBadge['user']
    });
  }

  async update(key: BadgeWithKey['key'], badge: BadgeForm) {
    return this.collection.doc(key).update({
      clock: badge.clock,
      timestamp: this.dateService.isoToJsDate(badge.timestamp) ?? new Date(),
    });
  }

  deleteByKey(key: BadgeWithKey['key']) {
    return this.collection.doc(key).delete();
  }

}
