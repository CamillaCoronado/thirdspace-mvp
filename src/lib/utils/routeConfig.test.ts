import { describe, it, expect } from 'vitest';
import {
  isPublicOnlyRoute,
  isProtectedRoute,
  publicOnlyRoutes,
  protectedRoutes,
} from './routeConfig';
import { navigationMap } from '$lib/navigationMap';

describe('Route Utilities', () => {
  it('should correctly identify public-only routes', () => {
    publicOnlyRoutes.forEach((route) => {
      const path = navigationMap[route].path;
      expect(isPublicOnlyRoute(path)).toBe(true);
      expect(isProtectedRoute(path)).toBe(false);
    });
  });

  it('should correctly identify protected routes', () => {
    protectedRoutes.forEach((route) => {
      const path = navigationMap[route].path;
      expect(isProtectedRoute(path)).toBe(true);
      expect(isPublicOnlyRoute(path)).toBe(false);
    });
  });

  it('should return false for routes not in the lists', () => {
    const unknownPath = '/unknown-route';
    expect(isPublicOnlyRoute(unknownPath)).toBe(false);
    expect(isProtectedRoute(unknownPath)).toBe(false);
  });
});
