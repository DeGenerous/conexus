import { get } from 'svelte/store';

import Account from '@lib/account';
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

export async function getCurrentUserRole(): Promise<Roles | null> {
  const user = await getCurrentUser();
  return user && user.role !== undefined ? user.role : null;
}

// Check user status
export async function userState(
  state: 'signed' | 'admin' | 'creator' | 'referred' = 'signed',
): Promise<boolean> {
  const user: Nullable<User> = await getCurrentUser();
  if (!user) return false;

  if (state === 'signed') return true;
  if (state === 'admin') return user.role === 'Admin';
  if (state === 'creator') return user.role === 'Creator';
  if (state === 'referred') return !!user.referred;

  return false;
}

// Check if route is protected for Admins
export async function ensureAdmin(
  path: string = '/dashboard/dream',
): Promise<void> {
  if (!(await userState('admin'))) redirectTo(path);
}

export async function ensureCreator(path = '/dashboard/dream') {
  const [isAdmin, isCreator] = await Promise.all([
    userState('admin'),
    userState('creator'),
  ]);

  if (!(isAdmin || isCreator)) redirectTo(path);
}
