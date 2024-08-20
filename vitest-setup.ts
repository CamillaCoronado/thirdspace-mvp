import '@testing-library/svelte/vitest';
import '@testing-library/jest-dom/vitest';
import dotenv from 'dotenv';

// Load the environment variables from the .env.development file
dotenv.config({ path: './.env.development' });

// Log the loaded environment variables for debugging purposes
console.log(
  'VITE_FIREBASE_API_KEY_DEV (process.env):',
  process.env.VITE_FIREBASE_API_KEY_DEV
);
console.log(
  'VITE_FIREBASE_AUTH_DOMAIN_DEV (process.env):',
  process.env.VITE_FIREBASE_AUTH_DOMAIN_DEV
);
console.log(
  'VITE_FIREBASE_PROJECT_ID_DEV (process.env):',
  process.env.VITE_FIREBASE_PROJECT_ID_DEV
);
console.log(
  'VITE_FIREBASE_STORAGE_BUCKET_DEV (process.env):',
  process.env.VITE_FIREBASE_STORAGE_BUCKET_DEV
);
console.log(
  'VITE_FIREBASE_MESSAGING_SENDER_ID_DEV (process.env):',
  process.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV
);
console.log(
  'VITE_FIREBASE_APP_ID_DEV (process.env):',
  process.env.VITE_FIREBASE_APP_ID_DEV
);
console.log(
  'VITE_FIREBASE_MEASUREMENT_ID_DEV (process.env):',
  process.env.VITE_FIREBASE_MEASUREMENT_ID_DEV
);

// Log the import.meta.env values to see if they're loaded as expected
console.log(
  'VITE_FIREBASE_API_KEY_DEV (import.meta.env):',
  import.meta.env.VITE_FIREBASE_API_KEY_DEV
);

// If you need to mock or set up additional things for your tests, you can do so here.
