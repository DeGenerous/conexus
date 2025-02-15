import { writable } from 'svelte/store';
import { CoNexus } from '@lib/conexus';
import { CoNexusGame } from '@libv2/story';

export const storyOld = writable<Nullable<CoNexus>>(null);
export const story = writable<Nullable<CoNexusGame>>(null);
export const loading = writable<boolean>(false);
export const background_music = writable<Nullable<string>>(null);
export const background_image = writable<Nullable<string>>(null);
export const fullscreen = writable<boolean>(false);
