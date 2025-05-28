import { writable } from 'svelte/store';

export const prevStoryLink = writable<Nullable<string>>(null);
export const nextStoryLink = writable<Nullable<string>>(null);

export const prevStoryName = writable<string>("");
export const nextStoryName = writable<string>("");
