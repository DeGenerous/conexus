import Account from '@lib/account';
import { isAdmin, isCreator } from '@stores/account.svelte';

// Get the user object
export async function getCurrentUser(): Promise<Nullable<User>> {
  return await Account.getUser();
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
  if (state === 'admin') return true; // TODO: For testing
  if (state === 'creator') return false;
  // if (state === 'admin') return user.role === 'Admin';
  // if (state === 'creator') return user.role === 'Creator';
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
  const [_isAdmin, _isCreator] = await Promise.all([
    userState('admin'),
    userState('creator'),
  ]);

  isAdmin.set(_isAdmin);
  isCreator.set(_isCreator);

  if (!(_isAdmin || _isCreator)) redirectTo(path);
}
