export const navigationMap: Record<
  string,
  {
    path: string;
    back?: string;
    forward?: string;
  }
> = {
  Home: {
    path: '/',
    forward: 'Signup',
  },
  Signup: {
    path: '/signup',
    back: 'Home',
    forward: 'Onboarding',
  },
  EmailLogin: {
    path: '/signup/emaillogin',
    back: 'Signup',
    forward: 'Dashboard',
  },
  EmailSignup: {
    path: '/signup/emailsignup',
    back: 'Signup',
    forward: 'Onboarding',
  },
  Dashboard: {
    path: '/dashboard',
    back: 'EmailSignup',
  },
  Profile: {
    path: '/profile',
    back: 'Dashboard',
    forward: 'Settings',
  },
  Onboarding: {
    path: '/onboarding',
    forward: 'OnboardingMatch',
  },
  OnboardingMatch: {
    path: '/onboarding-instant-match',
    back: 'Onboarding',
    forward: 'OnboardingMeet'
  },
  OnboardingMeet: {
    path: '/onboarding-meet-share',
    back: 'OnboardingMatch',
    forward: 'Dashboard'
  },
  Settings: {
    path: '/settings',
    back: 'Profile',
  },
  // Add more routes as needed
};
