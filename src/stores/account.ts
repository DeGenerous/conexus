import { writable } from 'svelte/store';

export const web3LoggedIn = writable<boolean>(false);
export const web3loginError = writable<boolean>(false);
export const authenticated = writable<{
  user: Nullable<User>;
  loggedIn: boolean;
}>({ user: null, loggedIn: false });
export const referralCodes = writable<ReferralCode[]>([]);
