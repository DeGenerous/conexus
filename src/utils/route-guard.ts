import Account from '@lib/account';
import Environment from '@lib/environment';
import {
  isAdmin,
  isPlayer,
  isGuest,
  approvedTester,
} from '@stores/account.svelte';

// Get the user object
export async function getCurrentUser(
  refresh: boolean = false,
): Promise<Nullable<User>> {
  return await Account.getUser(refresh);
}

export function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    if (path === 'back') {
      window.history.back();
      return;
    }

    const target = new URL(path, window.location.origin);
    const current = new URL(window.location.href);

    const hasDifferentPath =
      current.pathname !== target.pathname || current.search !== target.search;
    const hasDifferentHash = current.hash !== target.hash;

    if (hasDifferentPath || hasDifferentHash) {
      window.location.href = target.href;
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

  const role = user.role_name ?? 'Guest';

  const checks: Record<UserState, () => boolean> = {
    signed: () => true,
    admin: () => role === 'Admin',
    player: () => role === 'Creator' || role === 'Player',
    guest: () => role === 'Guest',
    referred: () => Boolean(user.referred),
  };

  return checks[state]();
}

export async function ensureSigned(path = '/dashboard'): Promise<void> {
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
  const user = await getCurrentUser();

  if (!user) {
    redirectTo(path);
    isAdmin.set(false);
    isPlayer.set(false);
    isGuest.set(false);
    return { isAdmin: false, isPlayer: false, isGuest: false };
  }

  const role = user.role_name ?? 'Guest';
  const _isAdmin = role === 'Admin';
  const _isPlayer = role === 'Creator' || role === 'Player';
  const _isGuest = role === 'Guest';

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
  const environment = new Environment();
  const approved = await environment.isTester();
  approvedTester.set(Boolean(approved));
  if (!approved) redirectTo('/login'); // redirect to auth page
};
