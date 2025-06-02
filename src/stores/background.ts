import { writable } from 'svelte/store';

export const bgPicture = writable<Nullable<string>>("url('/mobileBG.webp')");
export const bgPictureOpacity = writable<number>(75);
export const bgColor = writable<string>('#000000');
