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
    forward: '/signup/zipcode',
  },
  EmailLogin: {
    path: '/signup/emaillogin',
    back: 'Signup',
    forward: '/allchat',
  },
  EmailSignup: {
    path: '/signup/emailsignup',
    back: 'Signup',
    forward: '/signup/zipcode',
  },
  ZipCode: {
    path: '/signup/zipcode',
    back: 'EmailSignup',
    forward: '/signup/birthday',
  },
  Birthday: {
    path: '/signup/birthday',
    back: '/signup/name',
    forward: '/signup/name',
  },
  Name: {
    path: '/signup/name',
    back: '/signup/birthday',
    forward: '/allchat',
  },
  AllChat: {
    path: '/allchat',
    back: '/signup/name',
  },
  Dashboard: {
    path: '/dashboard',
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
    //dynamic back
  },
  // Add more routes as needed
};
