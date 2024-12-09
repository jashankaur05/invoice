// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  name: 'dev',
  production: false,
  apiUrl: 'https://fdwa8dazdev0001.azurewebsites.net/api/v1',
  firebaseConfig: {
    apiKey: "AIzaSyCg_XypES3umCGouaQCLCm5ipQAqPBGj-M",
    authDomain: "softwiz-infotech-dcb1c.firebaseapp.com",
    databaseURL: "https://softwiz-infotech-dcb1c-default-rtdb.firebaseio.com",
    projectId: "softwiz-infotech-dcb1c",
    storageBucket: "softwiz-infotech-dcb1c.firebasestorage.app",
    messagingSenderId: "839632247256",
    appId: "1:839632247256:web:7a696014876c1b3ce1baad",
    measurementId: "G-31PFDJTFR4"
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
