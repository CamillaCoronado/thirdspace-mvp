import { months } from "../../lib/utils/dateUtils";
import { FirebaseError } from 'firebase/app';
import zxcvbn from 'zxcvbn';
import type { Auth } from 'firebase/auth';
import { validatePassword } from 'firebase/auth';

interface ErrorItem {
  inputName: string;
  message: string;
}

export function displayError(errors: ErrorItem[]): void {
  console.log('Displaying errors:', errors);
  errors.forEach(error => {
    const formElement = document.querySelector(`[name="${error.inputName}"]`);
    const errorMessage = formElement?.parentElement?.querySelector('.error-message');

    console.log(`For input ${error.inputName}:`, { formElement, errorMessage });

    if (formElement instanceof HTMLElement && errorMessage instanceof HTMLElement) {
      formElement.classList.add('text-dark-pink');
      errorMessage.textContent = error.message;
      errorMessage.classList.add('text-dark-pink');
      console.log(`Error displayed for ${error.inputName}`);
    } else {
      console.log(`Failed to display error for ${error.inputName}`);
    }
  });
}

export function validateDateFields(month: string, day: number, year: number): boolean {
  console.log('Validating date fields:', { month, day, year });
  const errors: ErrorItem[] = [];
  const currentYear = new Date().getFullYear();

  if (!months.includes(month)) {
    console.log('Invalid month');
    errors.push({ inputName: 'month', message: 'Invalid month selected.' });
  }

  if (day < 1 || day > 31) {
    console.log('Invalid day');
    errors.push({ inputName: 'day', message: 'Day must be between 1 and 31.' });
  }

  if (year < 1900 || year > currentYear - 18) {
    console.log('Invalid year');
    errors.push({ inputName: 'year', message: `Year must be between 1900 and ${currentYear - 18}.` });
  }

  if (errors.length > 0) {
    console.log('Date validation failed');
    displayError(errors);
    return false;
  }

  console.log('Date validation passed');
  return true;
}

export function validateEmail(email: string): boolean {
  console.log('Validating email:', email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,63}$/;
  const parts = email.split('@');
  const domainParts = parts.length === 2 ? parts[1].split('.') : [];
  const tld = domainParts[domainParts.length - 1]?.toLowerCase();
  const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'io', 'co', 'uk', 'de', 'fr', 'jp', 'au', 'nz'];

  if (
    !emailRegex.test(email) || 
    email.length > 254 || 
    parts.length !== 2 || 
    parts[0].length === 0 || 
    parts[0].length > 64 || 
    domainParts.length < 2 || 
    !validTLDs.includes(tld)
  ) {
    console.log('Email validation failed');
    displayError([{ inputName: 'email', message: 'Invalid email format' }]);
    return false;
  }

  console.log('Email validation passed');
  return true;
}


export async function customValidatePassword(password: string, auth: Auth, action: 'CreateAccount' | 'SignIn'): Promise<boolean> {
  console.log('Validating password for action:', action);
  if (action === 'CreateAccount') {
    const zxcvbnResult = zxcvbn(password);
    console.log('zxcvbn score:', zxcvbnResult.score);
    if (zxcvbnResult.score < 3) {
      console.log('Password too weak');
      displayError([{ inputName: 'password', message: 'Password is too weak. Please choose a stronger password.' }]);
      return false;
    }

    try {
      console.log('Validating password with Firebase');
      await validatePassword(auth, password);
      console.log('Firebase password validation passed');
    } catch (error) {
      console.log('Firebase password validation failed:', error);
      if (error instanceof FirebaseError) {
        displayError([{ inputName: 'password', message: `Invalid password: ${error.message}` }]);
      } else {
        displayError([{ inputName: 'password', message: `An unexpected error occurred: ${(error as Error).message}` }]);
      }
      return false;
    }
  }
  console.log('Password validation passed');
  return true;
}