export interface ValidationError {
  inputName: string;
  message: string;
}

export interface AuthState {
  error: string | null;
  currentInputName: string | undefined;
}

export function handleError(error: Error, inputName: string): void {
  const errorMessage = error ? error.message : 'An unknown error occurred';
  displayError([{ inputName: inputName ?? 'unknown', message: errorMessage }]);
}

export function displayError(errors: ValidationError[]): void {
  // Your error display logic here
  console.error('Validation errors:', errors);
  errors.forEach(error => {
    // Add any UI error display logic here
    console.error(`Error for ${error.inputName}: ${error.message}`);
  });
}