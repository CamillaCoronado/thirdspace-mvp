import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseDevConfig from './firebaseConfig.dev';
import firebaseProdConfig from './firebaseConfig.prod';

const environment = process.env.NODE_ENV;
const config = environment === 'production' ? firebaseProdConfig : firebaseDevConfig;

const app = initializeApp(config);


export const auth = getAuth(app);

