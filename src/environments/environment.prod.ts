
import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  name: 'prod',
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
