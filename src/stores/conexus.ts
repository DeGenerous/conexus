import { writable } from 'svelte/store';
import type { CoNexus } from "../lib/conexus";

export const story = writable<Nullable<CoNexus>>(null);
export const loading = writable<boolean>(false);
export const background_music = writable<Nullable<string>>(null);
export const background_image = writable<Nullable<string>>(null);
export const fullscreen = writable<boolean>(false);
