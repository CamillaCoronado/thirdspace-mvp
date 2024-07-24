import { months } from "../../lib/utils/dateUtils";
import { FirebaseError } from 'firebase/app';
import zxcvbn from 'zxcvbn';
import type { Auth } from 'firebase/auth';
import { validatePassword } from 'firebase/auth';
import { handleError } from "./auth";

interface ErrorItem {
  inputName: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ErrorItem[];
}

export function displayError(errors: ErrorItem[]): void {
  errors.forEach(error => {
    const formElements = document.querySelectorAll(`[data-input-name="${error.inputName}"]`);
    const errorMessage = document.querySelector(`[data-error-for="${error.inputName}"]`);
    formElements.forEach((formElement) => {
      if (formElement instanceof HTMLElement && errorMessage instanceof HTMLElement) {
        formElement.classList.add('error');
        errorMessage.textContent = error.message;
        errorMessage.classList.add('error');
        errorMessage.classList.remove('hidden');
      } else {
        console.error(`Form element or error message element for "${error.inputName}" not found.`);
      }
    });
    
  });
}

export function clearErrors(fieldNames: string[]): void {
  fieldNames.forEach(fieldName => {
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`) as HTMLElement | null;
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
    
    const inputFields = document.querySelectorAll(`[data-input-name="${fieldName}"]`);

    inputFields.forEach((inputElement) => {
      inputElement.classList.remove('error');
    });
  });
}

export function validateDateFields(month: string, day: number, year: number): ValidationResult {
  const errors: ErrorItem[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  if (!months.includes(month)) errors.push({ inputName: 'month', message: 'Invalid month.' });
  if (day < 1 || day > 31) errors.push({ inputName: 'day', message: 'Day must be 1-31.' });
  if (year < 1900 || year > currentYear) errors.push({ inputName: 'year', message: `Year must be 1900-${currentYear}.` });

  const birthDate = new Date(year, months.indexOf(month), day);
  const eighteenYearsAgo = new Date(currentDate);
  eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);
  
  if (birthDate > eighteenYearsAgo) errors.push({ inputName: 'date', message: 'You must be at least 18 years old.' });

  return { isValid: errors.length === 0, errors };
}

export function validateEmail(email: string): boolean {
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
    
    handleError(new Error('Invalid email format'), 'email');
    return false;
  }

  clearErrors(['email']);
  return true;
}


async function validatePasswordStrength(auth: Auth, password: string): Promise<boolean> {
  // Check password strength
  if (zxcvbn(password).score < 3) {
    displayError([{ inputName: 'password', message: 'Password is too weak. Please choose a stronger password.' }]);
    return false;
  }

  // Validate with Firebase
  try {
    await validatePassword(auth, password);
    clearErrors(['password']);
    return true;
  } catch (error) {
    const message = error instanceof FirebaseError
      ? `Invalid password: ${error.message}`
      : `An unexpected error occurred: ${(error as Error).message}`;
    displayError([{ inputName: 'password', message }]);
    return false;
  }
}

function validatePasswordMatch(password: string, passwordVerification: string): boolean {
  if (password !== passwordVerification) {
    displayError([{ inputName: 'password-verification', message: 'Passwords do not match.' }]);
    return false;
  }
  clearErrors(['password-verification']);
  return true;
}

export async function customValidatePassword(
  password: string, 
  auth: Auth, 
  action: 'CreateAccount' | 'SignIn', 
  passwordVerification?: string
): Promise<boolean> {
  if (action !== 'CreateAccount') return true;

  const passwordValid = await validatePasswordStrength(auth, password);
  const matchValid = passwordVerification ? validatePasswordMatch(password, passwordVerification) : true;

  if (!passwordValid) return false;

  return matchValid;
}