import { writable } from 'svelte/store';

export const iosDevice = writable<boolean>(false);
