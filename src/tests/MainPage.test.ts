// tests/MainPage.test.ts
import { render, screen, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import MainPage from '../routes/+page.svelte'; // Correct import path

// Mock the navigation functions to prevent actual navigation
vi.mock('../lib/navigation.ts', () => ({
  navigateTo: vi.fn(),
}));

// Mock the initiateAuth function
import { initiateAuth } from '../lib/utils/auth';
vi.mock('../lib/utils/auth.ts', () => ({
  initiateAuth: vi.fn(),
}));

describe('MainPage', () => {
  beforeEach(() => {
    render(MainPage);
  });

  test('should render the page', () => {
    // Ensure the main elements are present
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Just common enough to click')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('should call initiateAuth with "CreateAccount" when Create account button is clicked', () => {
    const createAccountButton = screen.getByText('Create account');
    fireEvent.click(createAccountButton);

    // Check if initiateAuth was called with the correct argument
    expect(initiateAuth).toHaveBeenCalledWith('CreateAccount');
  });

  test('should call initiateAuth with "SignIn" when Sign In button is clicked', () => {
    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    // Check if initiateAuth was called with the correct argument
    expect(initiateAuth).toHaveBeenCalledWith('SignIn');
  });
});
