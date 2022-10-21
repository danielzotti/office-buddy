import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable()
export class AppCheckUpdateService {

  constructor(private swUpdate: SwUpdate) {
  }

  init() {
    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(event => {
        console.debug({ versionCheck: event });
        if(confirm(`A new version is available, do you want to upgrade from v${ event.currentVersion } to v${ event.latestVersion }?`)) {
          // Reload the page to update to the latest version.
          document.location.reload();
        }
      });
  }
}
