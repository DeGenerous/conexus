import Account from '@lib/account';
import {
  isAdmin,
  isPlayer,
  isGuest,
  approvedTester,
} from '@stores/account.svelte';
import { ClearCache } from '@constants/cache';

// Get the user object
export async function getCurrentUser(
  refresh: boolean = false,
): Promise<Nullable<User>> {
  if (refresh) ClearCache('auth');
  return await Account.getUser(refresh);
}

export function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    if (window.location.pathname !== path) {
      window.location.href = path;
    }
  }
}

export async function getCurrentUserRole(): Promise<DefaultRoles | null> {
  const user = await getCurrentUser();
  return user && user.role_name !== undefined ? user.role_name : null;
}

// Check user status
export async function userState(state: UserState = 'signed'): Promise<boolean> {
  const user: Nullable<User> = await getCurrentUser();
  if (!user) return false;

  const checks: Record<UserState, () => boolean> = {
    signed: () => true,
    admin: () => user.role_name === 'Admin',
    player: () => user.role_name === 'Creator' || user.role_name === 'Player',
    guest: () => user.role_name === 'Guest',
    referred: () => Boolean(user.referred),
  };

  return checks[state]();
}

export async function ensureSigned(path = '/'): Promise<void> {
  if (!(await userState('signed'))) redirectTo(path);
}

// Check if route is protected for Admins
export async function ensureAdmin(path = '/dashboard'): Promise<void> {
  if (!(await userState('admin'))) redirectTo(path);
}

// Check if route is protected for Players
export async function ensurePlayer(path = '/dashboard'): Promise<void> {
  const [player, admin] = await Promise.all([
    userState('player'),
    userState('admin'),
  ]);

  if (!(player || admin)) {
    redirectTo(path);
  }
}

// Check if route is protected for Guests
export async function restrictToGuest(path = '/dashboard'): Promise<void> {
  if (await userState('guest')) redirectTo(path);
}

export async function checkUserRoles(
  path = '/dashboard',
): Promise<{ isAdmin: boolean; isPlayer: boolean; isGuest: boolean }> {
  const [_isAdmin, _isPlayer, _isGuest] = await Promise.all([
    userState('admin'),
    userState('player'),
    userState('guest'),
  ]);

  if (!(_isAdmin || _isPlayer || _isGuest)) redirectTo(path);

  isAdmin.set(_isAdmin);
  isPlayer.set(_isPlayer);
  isGuest.set(_isGuest);

  return {
    isAdmin: _isAdmin,
    isPlayer: _isPlayer,
    isGuest: _isGuest,
  };
}

export const checkIfTesterApproved = async (): Promise<void> => {
  const approved = await Promise.resolve(true); // Simulate API response
  approvedTester.set(approved);
  if (!approved) redirectTo('/login'); // redirect to auth page
};
