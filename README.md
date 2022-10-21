# OfficeBuddy

This PWA is used at the office to badge the start and the end of the working day.

It has been created just to play with some cool technologies:

- Angular
- Angular Material
- Angularfire
- Firebase Realtime Database
- NFC Browser API
- Permission API
- Android device remote debugging

## Test it on your local machine

- `npm install`
- `npm run start`

## Test NFC feature on your smartphone

- `npm run start:public` aka `ng serve --host 0.0.0.0 --ssl` on your local machine:
    - `--host 0.0.0.0`: same network (e.g. your local machine IP might be 192.168.1.2)
    - `--ssl`: NFC works only through `https`
    - NB: if your local machine is behind a firewall, you might have to change some configurations depending on your
      firewall/machine/...
- Connect your smartphone to your local machine through USB
    - grant permissions on the smartphone
- Browse `https://192.168.1.2:4200` on your smartphone
- Open chrome debug `chrome://inspect/#devices` on your local machine
- Select `inspect` under the `https://192.168.1.2:4200` item in the list

## Deploy

- [GitHub pages with GitHub Actions](https://github.com/marketplace/actions/github-pages-action)

## Useful links

- [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API?retiredLocale=it)
- [Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [Get angular-cli to ng serve over HTTPS](https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https)
- [How to allow access outside localhost](https://stackoverflow.com/questions/43492354/how-to-allow-access-outside-localhost)
- [NFC examples](https://whatwebcando.today/nfc.html)
- [NFC examples (Web.dev)](https://web.dev/nfc/#check-for-permission)
