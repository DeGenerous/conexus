// src/lib/notifications/store.ts
import { writable } from 'svelte/store';

export const notifications = writable<Array<AccountNotification>>([]);
export const unread = writable<number>(0);
