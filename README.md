# OfficeBuddy

This PWA is used at the office to badge the start and the end of the working day.

It has been created just to play with some cool technologies:

- Angular
- Angular Material
- Angularfire
- Angular PWA
- Firebase Firestore Database ~~Realtime Database~~
- Permission API
- NFC Browser API
- Android device remote debugging

## Test it on your local machine

- `npm install`
- `npm run start`

## Test NFC feature on your smartphone

- `npm run start` aka `ng serve` on your local machine:
- Connect your smartphone to your local machine through USB
    - grant permissions on the smartphone
- Open chrome debug `chrome://inspect/#devices` on your local machine
- Click on `Port forwarding...` button and add a new record:
  - Port: `4200`
  - IP address and port: `localhost:4200`
  - Check `Enable port forwarding` and click `Done`
- Browse `https://localhost:4200` on your smartphone
- Select `inspect` under the `https://localhost:4200` item in the list

## Deploy

- [GitHub pages with GitHub Actions](https://github.com/marketplace/actions/github-pages-action)

## Useful links

- [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API?retiredLocale=it)
- [Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [Get angular-cli to ng serve over HTTPS](https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https)
- [How to allow access outside localhost](https://stackoverflow.com/questions/43492354/how-to-allow-access-outside-localhost)
- [NFC examples](https://whatwebcando.today/nfc.html)
- [NFC examples (Web.dev)](https://web.dev/nfc/#check-for-permission)

## Todo
- Manage badge as a single day (in + out)
- Send notifications to colleagues after badge
- Fix
  ~~- login/logout redirect~~
  ~~- Every user should manage their badges only~~
- ~~PWA: Manage app version with packages.json~~
- ~~PWA: Check for updates~~
- Router
  - User profile page
  ~~- Home with 2 buttons (in/out) + NFC capability~~
  ~~- Badges list page~~
  ~~- Users list page~~
- Manage users
  - CRUD (for the creation the `uid` is needed, and `uid` is created after the first login)
  - Authorization (simple or admin)
- Use Google Spreadsheet to store just badges data in order to do some analysis
- ...more
