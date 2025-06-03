import { writable } from 'svelte/store';

export const bgPicture = writable<Nullable<string>>("url('/mobileBG.webp')");
export const bgPictureOpacity = writable<number>(50);
export const bgColor = writable<string>('#000000');
