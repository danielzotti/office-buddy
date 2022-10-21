import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable()
export class AppCheckUpdateService {


  constructor(private swUpdate: SwUpdate) {

  }

  init() {
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        console.log(evt);
        if(prompt('A new version is available, do you want to update?')) {
          // Reload the page to update to the latest version.
          document.location.reload();
        }
      });
  }
}
