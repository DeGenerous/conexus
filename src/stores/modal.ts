import { writable } from "svelte/store";

export const showModal = writable<boolean>(false);
export const showProfile = writable<boolean>(false);