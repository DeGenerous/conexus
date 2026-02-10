import { writable } from 'svelte/store';

import {
  GetCache,
  SetCache,
  PERSONAL_SETUP_KEY,
  USER_KEY,
} from '@constants/cache';

// Global account state flags shared across the dashboard UI

export const accountError = writable<AccountError>(null);

function getCachedUser(): Nullable<User> {
  if (typeof window === 'undefined') return null;
  try {
    return GetCache<User>(USER_KEY);
  } catch {
    return null;
  }
}

function deriveInitialRoles(u: Nullable<User>) {
  const role = u?.role_name ?? 'Guest';
  return {
    admin: role === 'Admin',
    creator: role === 'Creator',
    player: role === 'Creator' || role === 'Player',
    guest: role === 'Guest',
  };
}

const cachedUser = getCachedUser();
const initialRoles = deriveInitialRoles(cachedUser);

export const user = writable<Nullable<User>>(cachedUser);

export const developerMode = writable<boolean>(false);
export const approvedTester = writable<boolean>(true);

export const isAdmin = writable<boolean>(initialRoles.admin);
export const isCreator = writable<boolean>(initialRoles.creator);
export const isPlayer = writable<boolean>(initialRoles.player);
export const isGuest = writable<boolean>(initialRoles.guest);

// Personal Settings & Theme & Play Mode

export const getPersonalSetup = (): PreferredSetup => {
  const storedSetup = GetCache<PreferredSetup>(PERSONAL_SETUP_KEY);
  return storedSetup || { settings: 'default', theme: 'default' };
};

export const setPersonalSetup = ({
  settings,
  theme,
  play_mode,
}: PreferredSetup): void => {
  SetCache(PERSONAL_SETUP_KEY, { settings, theme, play_mode });
};
