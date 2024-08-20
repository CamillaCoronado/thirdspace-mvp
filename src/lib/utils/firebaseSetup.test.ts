import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually set the environment variables for both dev and prod in the test
beforeEach(() => {
  vi.stubGlobal('import.meta', {
    env: {
      VITE_FIREBASE_API_KEY:
        process.env.VITE_FIREBASE_API_KEY || 'fake-prod-api-key',
      VITE_FIREBASE_AUTH_DOMAIN:
        process.env.VITE_FIREBASE_AUTH_DOMAIN || 'fake-prod-auth-domain',
      VITE_FIREBASE_PROJECT_ID:
        process.env.VITE_FIREBASE_PROJECT_ID || 'fake-prod-project-id',
      VITE_FIREBASE_STORAGE_BUCKET:
        process.env.VITE_FIREBASE_STORAGE_BUCKET || 'fake-prod-storage-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID:
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
        'fake-prod-messaging-sender-id',
      VITE_FIREBASE_APP_ID:
        process.env.VITE_FIREBASE_APP_ID || 'fake-prod-app-id',
      VITE_FIREBASE_MEASUREMENT_ID:
        process.env.VITE_FIREBASE_MEASUREMENT_ID || 'fake-prod-measurement-id',

      VITE_FIREBASE_API_KEY_DEV:
        process.env.VITE_FIREBASE_API_KEY_DEV || 'fake-dev-api-key',
      VITE_FIREBASE_AUTH_DOMAIN_DEV:
        process.env.VITE_FIREBASE_AUTH_DOMAIN_DEV || 'fake-dev-auth-domain',
      VITE_FIREBASE_PROJECT_ID_DEV:
        process.env.VITE_FIREBASE_PROJECT_ID_DEV || 'fake-dev-project-id',
      VITE_FIREBASE_STORAGE_BUCKET_DEV:
        process.env.VITE_FIREBASE_STORAGE_BUCKET_DEV ||
        'fake-dev-storage-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID_DEV:
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV ||
        'fake-dev-messaging-sender-id',
      VITE_FIREBASE_APP_ID_DEV:
        process.env.VITE_FIREBASE_APP_ID_DEV || 'fake-dev-app-id',
      VITE_FIREBASE_MEASUREMENT_ID_DEV:
        process.env.VITE_FIREBASE_MEASUREMENT_ID_DEV ||
        'fake-dev-measurement-id',
    },
  });

  vi.resetModules(); // Reset the module cache to ensure fresh imports

  vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
  }));

  vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
  }));
});

describe('firebaseSetup', () => {
  it('should mock auth in test environment', async () => {
    process.env.NODE_ENV = 'test';
    const { auth } = await import('./firebaseSetup');

    expect(auth).toBeDefined();
    expect(auth.onAuthStateChanged).toBeInstanceOf(Function);

    const callback = vi.fn();
    auth.onAuthStateChanged(callback);
    expect(callback).toHaveBeenCalledWith(null);
  });

  it('should initialize Firebase with dev config in development environment', async () => {
    process.env.NODE_ENV = 'development';
    const { initializeApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    const { auth } = await import('./firebaseSetup');
    const firebaseDevConfig = await import('./firebaseConfig.dev');

    console.log('Firebase Dev Config:', firebaseDevConfig.default);

    expect(initializeApp).toHaveBeenCalledWith(firebaseDevConfig.default);
    expect(getAuth).toHaveBeenCalled();
  });
});
