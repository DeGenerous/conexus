import { writable } from 'svelte/store';

export const bgPicture = writable<string>("url('/mobileBG.webp')");
