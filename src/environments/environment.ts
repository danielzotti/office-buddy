// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageJson from '../../package.json';

export const environment = {
  production: false,
  appVersion: packageJson.version,
  firebase: {
    projectId: 'office-buddy-trieste',
    appId: '1:1068194485548:web:6aa016842792c2728a0889',
    storageBucket: 'office-buddy-trieste.appspot.com',
    apiKey: 'AIzaSyAaOlWtCuWDd6ujq6fvRY7Nm_XqU-Uo93g',
    authDomain: 'office-buddy-trieste.firebaseapp.com',
    messagingSenderId: '1068194485548',
    measurementId: 'G-YLR034EBYB',
    databaseURL: 'https://office-buddy-trieste-default-rtdb.europe-west1.firebasedatabase.app/'
  },
  firebaseApiUrls: {
    badges: '/badges',
    users: '/users',
  },
  formatter: {
    shortDate: '',
    longDate: '',
    badgeIsoDateTime: 'yyyy-MM-ddTHH:mm',
    badgeHumanDateTime: 'dd/MM/yyyy HH:mm'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
