import Account from '@lib/account';
import { isAdmin, isCreator } from '@stores/account.svelte';
import { ClearCache } from '@constants/cache';

// Get the user object
export async function getCurrentUser(
  refresh: boolean = false,
): Promise<Nullable<User>> {
  if (refresh) ClearCache('auth');
  return await Account.getUser(refresh);
}

function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

export async function getCurrentUserRole(): Promise<DefaultRoles | null> {
  const user = await getCurrentUser();
  return user && user.role_name !== undefined ? user.role_name : null;
}

type UserState = 'signed' | 'admin' | 'creator' | 'referred';

// Check user status
export async function userState(state: UserState = 'signed'): Promise<boolean> {
  const user: Nullable<User> = await getCurrentUser();
  if (!user) return false;

  const checks: Record<UserState, () => boolean> = {
    signed: () => true,
    admin: () => user.role_name === 'Admin',
    creator: () => user.role_name === 'Creator',
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
