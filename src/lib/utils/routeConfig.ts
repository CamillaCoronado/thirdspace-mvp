import { navigationMap } from '$lib/navigationMap';

export const publicOnlyRoutes = [
  'Home',
  'Signup',
  'EmailLogin',
  'EmailSignup'];
export const protectedRoutes = [
  'Dashboard',
  'Profile',
  'Settings',
  "Onboarding",
  "OnboardingMatch",
  "OnboardingMeet"];

export const isPublicOnlyRoute = (path: string) =>
  publicOnlyRoutes.some((route) => path === navigationMap[route].path);

export const isProtectedRoute = (path: string) =>
  protectedRoutes.some((route) => path.startsWith(navigationMap[route].path));
