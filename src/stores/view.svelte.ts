import { writable } from 'svelte/store';
import { toastStore } from './toast.svelte';

// Cache of genres shared between view components (populated by AppView)
export const availableGenres = $state<Genre[]>([]);

// Handler for pull-to-refresh functionality
export const handlePullRefresh = writable<Nullable<() => Promise<void>>>(null);

const refreshHandlers = new Set<() => Promise<void>>();

const propagateHandlers = () => {
  if (refreshHandlers.size === 0) {
    handlePullRefresh.set(null);
    return;
  }

  handlePullRefresh.set(async () => {
    for (const handler of Array.from(refreshHandlers)) {
      await handler();
    }
    toastStore.show('Data refreshed successfully');
  });
};

/**
 * Clear registered pull-to-refresh handlers. If a handler is provided,
 * only that handler is removed; otherwise every handler is cleared.
 */
export function clearPullRefresh(handler?: () => Promise<void>): void {
  if (handler) refreshHandlers.delete(handler);
  else refreshHandlers.clear();
  propagateHandlers();
}

/**
 * Register a pull-to-refresh handler and return a disposer
 * that clears only that handler.
 */
export function registerPullRefresh(handler: () => Promise<void>): () => void {
  refreshHandlers.add(handler);
  propagateHandlers();
  return () => {
    if (refreshHandlers.delete(handler)) {
      propagateHandlers();
    }
  };
}
