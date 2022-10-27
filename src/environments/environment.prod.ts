import packageJson from '../../package.json';

export const environment = {
  production: true,
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
