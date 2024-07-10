// lib/utils/passwordValidation.ts

export interface PasswordValidationResult {
    isValid: boolean;
    error: string;
  }
  
  const MIN_LENGTH = 8;
  const UPPERCASE_REGEX = /[A-Z]/;
  const LOWERCASE_REGEX = /[a-z]/;
  const NUMBER_REGEX = /[0-9]/;
  const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
  
  interface PasswordRule {
    validate: (password: string) => boolean;
    errorMessage: string;
  }
  
  const passwordRules: PasswordRule[] = [
    {
      validate: (password) => password.length >= MIN_LENGTH,
      errorMessage: `Password must be at least ${MIN_LENGTH} characters long`
    },
    {
      validate: (password) => UPPERCASE_REGEX.test(password),
      errorMessage: 'Password must contain at least one uppercase letter'
    },
    {
      validate: (password) => LOWERCASE_REGEX.test(password),
      errorMessage: 'Password must contain at least one lowercase letter'
    },
    {
      validate: (password) => NUMBER_REGEX.test(password),
      errorMessage: 'Password must contain at least one number'
    },
    {
      validate: (password) => SPECIAL_CHAR_REGEX.test(password),
      errorMessage: 'Password must contain at least one special character'
    }
  ];
  
  export function customValidatePassword(password: string): PasswordValidationResult {
    for (const rule of passwordRules) {
      if (!rule.validate(password)) {
        return { isValid: false, error: rule.errorMessage };
      }
    }
    return { isValid: true, error: '' };
  }