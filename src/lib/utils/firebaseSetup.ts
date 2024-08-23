import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseDevConfig from './firebaseConfig.dev';
import firebaseProdConfig from './firebaseConfig.prod';

const environment = import.meta.env.MODE;

let auth: any; // Use any or the appropriate type

if (environment === 'test') {
  // During tests, do not initialize Firebase, just mock the auth object
  auth = {
    onAuthStateChanged: (callback: (user: any) => void) => {
      callback(null); // Simulate a user not being signed in
    },
    // You can add more mocked methods here if needed
  };
} else {
  const config =
    environment === 'production' ? firebaseProdConfig : firebaseDevConfig;
  const app = initializeApp(config);
  auth = getAuth(app);
}

export { auth };
