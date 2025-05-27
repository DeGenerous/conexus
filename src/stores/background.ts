import { writable } from 'svelte/store';

export const bgPicture = writable<Nullable<string>>(null);
