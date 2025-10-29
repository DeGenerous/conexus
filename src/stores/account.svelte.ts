import { writable } from 'svelte/store';

import { GetCache, SetCache, PERSONAL_SETUP_KEY } from '@constants/cache';

// Global account state flags shared across the dashboard UI

export const accountError = writable<AccountError>(null);

export const user = writable<Nullable<User>>(null);
export const approvedTester = writable<boolean>(true);

export const isAdmin = writable<boolean>(false);
export const isCreator = writable<boolean>(false);
export const isPlayer = writable<boolean>(false);
export const isGuest = writable<boolean>(false);

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
