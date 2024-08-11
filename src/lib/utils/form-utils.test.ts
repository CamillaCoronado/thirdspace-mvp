import { describe, it, expect, vi } from 'vitest';
import { customValidatePassword } from './form-utils';
import { getAuth } from 'firebase/auth';
import zxcvbn from 'zxcvbn';

// Partially mock firebase/auth to include onAuthStateChanged
vi.mock('firebase/auth', async () => {
  const actual =
    await vi.importActual<typeof import('firebase/auth')>('firebase/auth');
  return {
    ...actual,
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(), // Mock onAuthStateChanged as a no-op
  };
});

vi.mock('zxcvbn');

describe('customValidatePassword', () => {
  const mockAuth = getAuth();

  it('should return false for a weak password', async () => {
    vi.mocked(zxcvbn).mockImplementation(() => ({ score: 1 }) as any); // Simulate weak password
    const result = await customValidatePassword(
      '12345',
      mockAuth,
      'CreateAccount'
    );
    expect(result).toBe(false);
  });

  it('should return false if passwords do not match', async () => {
    vi.mocked(zxcvbn).mockImplementation(() => ({ score: 4 }) as any); // Simulate strong password
    const result = await customValidatePassword(
      'Str0ngP@ssword!',
      mockAuth,
      'CreateAccount',
      'MismatchPassword'
    );
    expect(result).toBe(false);
  });
});
