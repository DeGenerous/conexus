import { writable } from 'svelte/store';
import { CoNexusGame } from '@lib/story';

export const story = writable<Nullable<CoNexusGame>>(null);
export const loading = writable<boolean>(false);
export const background_music = writable<Nullable<string>>(null);
export const background_image = writable<Nullable<string>>(null);
export const fullscreen = writable<boolean>(false);
