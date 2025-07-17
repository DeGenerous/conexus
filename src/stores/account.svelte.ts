import { writable } from 'svelte/store';

export const authenticated = writable<Nullable<User>>(null);

export const referralCodes = writable<ReferralCode[]>([]);

export const accountError = writable<AccountError>(null);
