import { get } from 'svelte/store';

import { Account } from '@lib/account';
import { authenticated } from '@stores/account.svelte';

const account: Account = new Account();

// Get the user object
export async function getCurrentUser(): Promise<Nullable<User>> {
  await account.me();

  const user = get(authenticated);
  if (user) return user;

  return null;
}

function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
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

// Check if route is protected for Admins
export async function ensureAdmin(
  path: string = '/dashboard/dream',
): Promise<void> {
  if (!(await userState('admin'))) redirectTo(path);
}
