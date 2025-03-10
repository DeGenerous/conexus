import { writable } from 'svelte/store';

export const availableGenres = writable<Genre[]>([]);