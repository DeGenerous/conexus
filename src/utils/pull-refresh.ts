import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

type RefreshHandler = () => Promise<void>;

export type PullRefreshController = {
  register: (handler: RefreshHandler) => () => void;
  refresh: () => Promise<void>;
  hasHandlers: Writable<boolean>;
};

const PULL_REFRESH_CONTEXT = Symbol('pull-refresh-context');

// App-wide pull-to-refresh context so any layout/page can opt in without a global store.
export function initPullRefreshContext(): PullRefreshController {
  const handlers = new Set<RefreshHandler>();
  const hasHandlers = writable<boolean>(false);

  const refresh = async () => {
    for (const handler of Array.from(handlers)) {
      await handler();
    }
  };

  const register = (handler: RefreshHandler) => {
    handlers.add(handler);
    hasHandlers.set(handlers.size > 0);

    return () => {
      if (handlers.delete(handler)) {
        hasHandlers.set(handlers.size > 0);
      }
    };
  };

  const controller: PullRefreshController = { register, refresh, hasHandlers };
  setContext(PULL_REFRESH_CONTEXT, controller);
  return controller;
}

export function usePullRefreshContext(): PullRefreshController | null {
  return getContext<PullRefreshController | null>(PULL_REFRESH_CONTEXT) ?? null;
}
