// src/lib/utils/navigation.ts
import { goto } from '$app/navigation';
import { navigationMap } from './navigationMap';

export function customNavigate(direction: 'forward' | 'back') {
  const currentPath = window.location.pathname;
  
  if (direction === 'back') {
    const previousPath = Object.entries(navigationMap).find(([_, value]) => value === currentPath)?.[0];
    if (previousPath) {
      goto(previousPath);
    } else {
      console.warn('No previous path found');
    }
  } else {
    const nextPath = navigationMap[currentPath];
    if (nextPath) {
      goto(nextPath);
    } else {
      console.warn('No next path found');
    }
  }
}

export function navigateTo(path: string) {
  goto(navigationMap[path] || path);
}