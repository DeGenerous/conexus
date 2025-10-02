import { writable } from 'svelte/store';

export const accountError = writable<AccountError>(null);

export const isAdmin = writable(false);
export const isCreator = writable(false);
