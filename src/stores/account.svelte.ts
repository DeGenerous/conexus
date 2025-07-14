import { writable } from 'svelte/store';

export const authenticated = writable<Nullable<User>>(null);

export const referralCodes = writable<ReferralCode[]>([]);

export const accountError = writable<AccountError>(null);

// Temporary User ID for the Agent
export const tempUserID = writable<Nullable<string>>(null);
