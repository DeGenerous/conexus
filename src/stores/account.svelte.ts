import { writable } from 'svelte/store';

// Global account state flags shared across the dashboard UI

export const accountError = writable<AccountError>(null);

export const isAdmin = writable(false);
export const isCreator = writable(false);
