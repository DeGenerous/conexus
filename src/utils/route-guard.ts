import { get } from 'svelte/store';

import { Account } from '@lib/account';
import { authenticated } from '@stores/account.svelte';

function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

const account: Account = new Account();

// Define route patterns
const protectedRoutes = [/^\/dashboard\/dream\/[^/]+$/];

// Helper function to match a route pattern
const isRouteProtected = (path: string) =>
  protectedRoutes.some((pattern) => pattern.test(path));

// Get the user object
export async function getCurrentUser(): Promise<Nullable<User>> {
  await account.me();

  const user = get(authenticated);
  if (user) return user;

  return null;
}

// Check if route is protected for Admins
export async function ensureAdmin(path: string): Promise<boolean> {
  if (!isRouteProtected(path)) return true;

  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirectTo('/');
    return false;
  }

  return true;
}

// Check user status
export async function userState(
  state: 'signed' | 'admin' | 'referred' = 'signed',
): Promise<boolean> {
  const user: Nullable<User> = await getCurrentUser();
  if (!user) return false;

  if (state === 'signed') return true;
  if (state === 'admin') return user.role === 'admin';
  if (state === 'referred') return !!user.referred;

  return false;
}
