import { writable } from 'svelte/store';

// Cache of genres shared between view components (populated by AppView)
export const availableGenres = $state<Genre[]>([]);

// Handler for pull-to-refresh functionality
export const handlePullRefresh = writable<Nullable<() => Promise<void>>>(null);
