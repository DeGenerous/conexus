import { get } from 'svelte/store';
import { GetCache, USER_CACHE_KEY } from '@constants/cache';
import { authenticated } from '@stores/account.svelte';

function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

// Define route patterns
const protectedRoutes = [
  /^\/dashboard\/dream\/[^/]+$/,
];

// Helper function to match a route pattern
const isRouteProtected = (path: string) =>
  protectedRoutes.some((pattern) => pattern.test(path));

// Get the user object
function getCurrentUser(): Nullable<User> {
  // 1. Try the reactive store
  const { user } = get(authenticated);
  if (user) return user;

  // 2. Fallback to cache; if found, rehydrate the store
  const cached = GetCache<User>(USER_CACHE_KEY);
  if (cached) {
    authenticated.set({ user: cached, loggedIn: true });
    return cached;
  }

  // 3. No user at all
  return null;
}

// Function to check if route is protected for Admins
export function ensureAdmin(path: string): boolean {
  if (!isRouteProtected(path)) return true;

  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirectTo('/');
    return false;
  }

  return true;
}

// USE IN onMount() / $effect() LIKE THIS:
// if (!ensureAdmin(window.location.pathname)) return;

export function userState(state: 'signed' | 'admin' | 'referred' = 'signed'): boolean {
  const user: Nullable<User> = getCurrentUser();
  if (!user) return false;

  if (state === 'signed') return true;
  if (state === 'admin') return user.role === 'admin';
  if (state === 'referred') return !!user.referred;

  return false;
}
