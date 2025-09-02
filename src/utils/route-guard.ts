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

type UserState = 'signed' | 'admin' | 'creator' | 'referred';

// Check user status
export async function userState(state: UserState = 'signed'): Promise<boolean> {
  const user: Nullable<User> = await getCurrentUser();
  if (!user) return false;

  const checks: Record<UserState, () => boolean> = {
    signed: () => true,
    admin: () => true,
    creator: () => user.role === 'Creator',
    // admin: () => user.role === 'Admin',
    // creator: () => user.role === 'Creator',
    referred: () => Boolean(user.referred),
  };

  return checks[state]();
}

// Check if route is protected for Admins
export async function ensureAdmin(path = '/dashboard/dream'): Promise<void> {
  if (!(await userState('admin'))) redirectTo(path);
}

export async function ensureCreator(
  path = '/dashboard',
): Promise<{ isAdmin: boolean; isCreator: boolean }> {
  const [_isAdmin, _isCreator] = await Promise.all([
    userState('admin'),
    userState('creator'),
  ]);

  isAdmin.set(_isAdmin);
  isCreator.set(_isCreator);

  if (!(_isAdmin || _isCreator)) redirectTo(path);

  return {
    isAdmin: _isAdmin,
    isCreator: _isCreator,
  };
}
