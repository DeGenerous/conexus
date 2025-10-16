import { writable } from 'svelte/store';

// Live notification inbox state (filled by NotificationService)
export const notifications = writable<Array<AccountNotification>>([]);
export const unread = writable<number>(0);
