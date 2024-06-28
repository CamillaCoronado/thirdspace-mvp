export const navigationMap: Record<string, {
  path: string;
  back?: string;
  forward?: string;
}> = {
  'Home': { 
    path: '/',
    forward: 'Signup' 
  },
  'Signup': { 
    path: '/signup',
    back: 'Home' 
  },
  'EmailLogin': { 
    path: '/signup/emaillogin',
    back: 'Signup', 
    forward: 'Dashboard' 
  },
  'EmailSignup': { 
    path: '/signup/emailsignup',
    back: 'Signup',
    forward: 'Onboarding'
  },
  'Dashboard': {
    path: '/dashboard',
    back: 'EmailSignup'
  },
  'Profile': {
    path: '/profile',
    back: 'Dashboard',
    forward: 'Settings'
  },
  'Settings': {
    path: '/settings',
    back: 'Profile'
  },
  // Add more routes as needed
};