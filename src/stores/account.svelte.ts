import { writable } from 'svelte/store';

export const authenticated = writable<{
  user: Nullable<User>;
  loggedIn: boolean;
}>({ user: null, loggedIn: false });

export const referralCodes = writable<ReferralCode[]>([]);

export const accountError = writable<AccountError>(null);
