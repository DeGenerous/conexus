import { writable, derived } from 'svelte/store';

// Shared navigation context so the header arrows can link between related pages

function createNavContext() {
  const { subscribe, set } = writable<Nullable<NavContext>>(null);

  /** Call this from each page/layout when it loads */
  function setContext(ctx: NavContext) {
    set(ctx);
  }

  /** Optional – clear on destroy if the page has no arrows */
  function clear() {
    set(null);
  }

  /** Derived helpers that Navigation.svelte can consume */
  const prev = derived({ subscribe }, (ctx) =>
    ctx && ctx.index > 0 ? ctx.items[ctx.index - 1] : null,
  );

  const next = derived({ subscribe }, (ctx) =>
    ctx && ctx.index < ctx.items.length - 1 ? ctx.items[ctx.index + 1] : null,
  );

  const hasContext = derived({ subscribe }, (ctx) => !!ctx);

  return { subscribe, setContext, clear, prev, next, hasContext };
}

export const navContext = createNavContext();

export const prevItem = navContext.prev;
export const nextItem = navContext.next;
export const hasNavContext = navContext.hasContext;

export const sidebarOpen = writable<boolean>(false);
