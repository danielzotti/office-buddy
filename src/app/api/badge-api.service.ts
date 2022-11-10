import { DateTime } from 'luxon';
import { Injectable } from '@angular/core';
import {
  Badge,
  BadgeForm,
  DbBadge
} from '../models/badge.models';
import {
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { documentId, Timestamp } from '@angular/fire/firestore';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { DateService } from '../modules/shared/services/date.service';
import { environment } from '../../environments/environment';
import { DbUser, DbUserWithKey } from '../models/user.models';
import { FirebaseHelperService } from '../modules/shared/services/firebase-helper.service';

@Injectable({
  providedIn: 'root'
})
export class BadgeApiService {

  private badges: AngularFirestoreCollection<DbBadge> = this.db.collection<DbBadge>(environment.firebaseApiUrls.badges);

  constructor(
    private db: AngularFirestore,
    private dateService: DateService,
    private firebaseHelper: FirebaseHelperService
  ) {
  }

  ngOnInit() {
  }

  getCollection(): Observable<Badge[]> {
    return this.firebaseHelper.collection(this.badges).pipe(
      switchMap((badges: DbBadge[]) => {
          if(!badges.length) {
            return of([]);
          }
          const userIdList = [...new Set(badges.map(badge => badge?.userId))];
          return this.firebaseHelper.collection(
            this.db.collection<DbUser>(environment.firebaseApiUrls.users,
              ref => ref.where(documentId(), 'in', userIdList)
            )).pipe(
            map((users) => {
              return users.reduce((usersMap, user) => ({
                ...usersMap,
                [user.key]: user
              }), {} as Record<DbUserWithKey['key'], DbUserWithKey>);
            }),
            map((usersMap) => badges.map(badge => {
              const user = usersMap[badge.userId];
              if(!user) {
                return null;
              }
              const { key: uid, isAdmin, ...userData } = user;
              return {
                ...badge,
                timestamp: (badge.timestamp as Timestamp)?.toDate().toISOString(),
                user: {
                  uid,
                  ...userData,
                }
              };
            }).filter(b => !!b) as Badge[])
          );
        }
      )
    );
  }

  getCollectionByUserId(userId: DbBadge['userId']) {
    return this.firebaseHelper.collection(this.db.collection<DbBadge>(environment.firebaseApiUrls.badges, ref => ref
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .orderBy('clock', 'desc'))
    ).pipe(
      map((badges) => {
        if(!badges.length) {
          return [];
        }
        return badges.map(badge => (
          {
            ...badge,
            timestamp: (badge?.timestamp as Timestamp)?.toDate().toISOString(),
          } as Badge
        ));
      })
    );
  }

  getTodayByUserId(userId: DbBadge['userId']) {
    const todayDate = new Date(DateTime.now().toFormat('yyyy-MM-dd'));
    const tomorrowDate = new Date(DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd'));
    return this.firebaseHelper.collection(this.db.collection<DbBadge>(environment.firebaseApiUrls.badges, ref => ref
      .where('userId', '==', userId)
      .where('timestamp', '>=', todayDate)
      .where('timestamp', '<', tomorrowDate)
      .orderBy('timestamp', 'desc')
    )).pipe(
      map((badges) => {
        if(!badges.length) {
          return [];
        }
        return badges.map(badge => (
          {
            ...badge,
            timestamp: (badge?.timestamp as Timestamp)?.toDate().toISOString(),
          } as Badge
        ));
      })
    );
  }

  async create(badge: BadgeForm) {
    if(!badge?.userId) {
      return;
    }

    return this.badges.add({
      clock: badge.clock,
      timestamp: this.dateService.isoToJsDate(badge.timestamp) ?? new Date(),
      userId: badge.userId
    });
  }

  async update(key: Badge['key'], badge: BadgeForm) {
    return this.badges.doc(key).update({
      clock: badge.clock,
      timestamp: this.dateService.isoToJsDate(badge.timestamp) ?? new Date(),
    });
  }

  deleteByKey(key: Badge['key']) {
    return this.badges.doc(key).delete();
  }

}
