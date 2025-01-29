import { writable } from 'svelte/store';

export const showModal = writable<boolean>(false);
export const showProfile = writable<boolean>(false);

export const secondButton = writable<string>('');
export const handleSecondButton = writable(() => {});
export const modalContent = writable<string>('');
