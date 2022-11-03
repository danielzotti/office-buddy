import { Injectable } from '@angular/core';
import {
  BadgeForm,
  BadgeWithKey,
  DbBadge, DbBadgeUser,
} from '../models/badge.models';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { DocumentReference, getDoc, Timestamp } from '@angular/fire/firestore';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { DateService } from '../modules/shared/services/date.service';
import { environment } from '../../environments/environment';
import { FirebaseHelperService } from '../modules/shared/services/firebase-helper.service';

@Injectable({
  providedIn: 'root'
})
export class BadgeApiService {

  private badges: AngularFirestoreCollection<DbBadge> = this.db.collection<DbBadge>(environment.firebaseApiUrls.badges);

  constructor(
    private db: AngularFirestore,
    private dateService: DateService,
    private firebaseHelper: FirebaseHelperService,
  ) {
  }

  ngOnInit() {
  }

  getCollection(): Observable<BadgeWithKey[]> {
    return this.firebaseHelper.collectionWithKey<DbBadge>(this.badges).pipe(
      switchMap((badges) => {
          if(!badges.length) {
            return of([]);
          }
          return combineLatest(
            badges.map(async badge => {
              if(!badge?.user) {
                return {
                  ...badge,
                  timestamp: (badge?.timestamp as Timestamp)?.toDate().toISOString(),
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

    const userRef = this.db.doc<DbBadgeUser>(`${ environment.firebaseApiUrls.users }/${ badge.userId }`).ref;
    return this.badges.add({
      clock: badge.clock,
      timestamp: this.dateService.isoToJsDate(badge.timestamp) ?? new Date(),
      user: userRef as unknown as DbBadge['user']
    });
  }

  async update(key: BadgeWithKey['key'], badge: BadgeForm) {
    return this.badges.doc(key).update({
      clock: badge.clock,
      timestamp: this.dateService.isoToJsDate(badge.timestamp) ?? new Date(),
    });
  }

  deleteByKey(key: BadgeWithKey['key']) {
    return this.badges.doc(key).delete();
  }

}
