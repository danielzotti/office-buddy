import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
  }

  start() {
    this.isLoadingSubject.next(true);
  }

  stop() {
    this.isLoadingSubject.next(false);
  }
}
