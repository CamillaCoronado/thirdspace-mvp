import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence   } from "firebase/auth";
import firebaseDevConfig from './firebaseConfig.dev';
import firebaseProdConfig from './firebaseConfig.prod';

const environment = process.env.NODE_ENV;
const config = environment === 'production' ? firebaseProdConfig : firebaseDevConfig;
console.log('Firebase config:', config);
const app = initializeApp(config);


export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

