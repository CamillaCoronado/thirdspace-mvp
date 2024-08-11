import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest'; // Type-only import
import { getAuthAction, setAuthAction, validateEmailAndPassword } from './auth';
import { validateEmail, customValidatePassword } from './form-utils';
import { auth } from '$lib/utils/firebaseSetup';

// Mock Firebase auth and its methods
vi.mock('firebase/auth', () => {
  const originalModule = vi.importActual('firebase/auth');

  return {
    ...originalModule,
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    FacebookAuthProvider: vi.fn(),
    OAuthProvider: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(), // Mocking onAuthStateChanged
  };
});

// Mock the utility functions
vi.mock('./form-utils', () => ({
  validateEmail: vi.fn(),
  customValidatePassword: vi.fn(),
}));

describe('Auth Store Tests', () => {
  describe('getAuthAction', () => {
    it('should return the default action "CreateAccount"', () => {
      const action = getAuthAction();
      expect(action).toBe('CreateAccount');
    });

    it('should return the updated action when setAuthAction is called', () => {
      setAuthAction('SignIn');
      const action = getAuthAction();
      expect(action).toBe('SignIn');
    });
  });

  describe('validateEmailAndPassword', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const passwordVerification = 'password123';
    const action = 'CreateAccount';

    beforeEach(() => {
      // Clear mocks before each test
      (validateEmail as Mock).mockClear();
      (customValidatePassword as Mock).mockClear();
    });

    it('should return true when both email and password are valid', async () => {
      (validateEmail as Mock).mockReturnValue(true);
      (customValidatePassword as Mock).mockResolvedValue(true);

      const result = await validateEmailAndPassword(
        email,
        password,
        action,
        auth,
        passwordVerification
      );
      expect(result).toBe(true);
    });

    it('should return false when the email is invalid', async () => {
      (validateEmail as Mock).mockReturnValue(false);
      (customValidatePassword as Mock).mockResolvedValue(true);

      const result = await validateEmailAndPassword(
        email,
        password,
        action,
        auth,
        passwordVerification
      );
      expect(result).toBe(false);
    });

    it('should return false when the password is invalid', async () => {
      (validateEmail as Mock).mockReturnValue(true);
      (customValidatePassword as Mock).mockResolvedValue(false);

      const result = await validateEmailAndPassword(
        email,
        password,
        action,
        auth,
        passwordVerification
      );
      expect(result).toBe(false);
    });

    it('should return false when both email and password are invalid', async () => {
      (validateEmail as Mock).mockReturnValue(false);
      (customValidatePassword as Mock).mockResolvedValue(false);

      const result = await validateEmailAndPassword(
        email,
        password,
        action,
        auth,
        passwordVerification
      );
      expect(result).toBe(false);
    });

    it('should handle edge cases with empty strings', async () => {
      const result = await validateEmailAndPassword('', '', action, auth);
      expect(result).toBe(false);
    });
  });
});
