import { writable } from 'svelte/store';

// Temporary: showProfile stays until login is moved to a dedicated page.
export const showProfile = writable<boolean>(false);
