import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

export type WithKey<T> = T & { key: string }

@Injectable({
  providedIn: 'root'
})
export class FirebaseHelperService {

  constructor() {
  }

  collectionWithKey<T>(collection: AngularFirestoreCollection<T>) {
    return collection.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => {
          const data = c.payload.doc.data();
          if(!data) {
            return null;
          }
          return { key: c.payload.doc.id, ...data } as WithKey<T>;
        }).filter(data => !!data)
      )
    );
  }

  docWithKey<T>(doc: AngularFirestoreDocument<T>) {
    return doc.snapshotChanges().pipe(
      map((change) => {
        const data = change.payload.data();
        if(!data) {
          return null;
        }
        return { key: change.payload.id, ...data } as WithKey<T>;
      })
    );
  }
}
