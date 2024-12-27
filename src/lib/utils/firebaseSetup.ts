import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import firebaseDevConfig from './firebaseConfig.dev';
import firebaseProdConfig from './firebaseConfig.prod';

const environment = process.env.NODE_ENV;
const config = environment === 'production' ? firebaseProdConfig : firebaseDevConfig;

const app = getApps().length === 0 ? initializeApp(config) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);
