import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { environment } from '../../../../environments/environment';

interface Options {
  debounceMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseHelperService {

  debounceTime = environment.defaults.debounceTime;

  constructor() {
  }

  collection<T>(collection: AngularFirestoreCollection<T>, { debounceMs }: Options = { debounceMs: this.debounceTime} ) {
    return collection.valueChanges({ idField: 'key' }).pipe(
      distinctUntilChanged(),
      debounceTime(debounceMs)
    );
  }

  doc<T>(doc: AngularFirestoreDocument<T>, { debounceMs }: Options = { debounceMs: this.debounceTime}) {
    return doc.valueChanges({ idField: 'key' }).pipe(
      distinctUntilChanged(),
      debounceTime(debounceMs)
    );
  }
}
