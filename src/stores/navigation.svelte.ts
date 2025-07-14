import { writable, derived } from 'svelte/store';

function createNavContext() {
  const { subscribe, set, update } = writable<Nullable<NavContext>>(null);

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
    ctx
      ? ctx.index > 0
        ? ctx.items[ctx.index - 1]
        : ctx.items[ctx.items.length - 1]
      : null,
  );

  const next = derived({ subscribe }, (ctx) =>
    ctx
      ? ctx.index < ctx.items.length - 1
        ? ctx.items[ctx.index + 1]
        : ctx.items[0]
      : null,
  );

  return { subscribe, setContext, clear, prev, next };
}

export const navContext = createNavContext();

export const prevItem = navContext.prev;
export const nextItem = navContext.next;

export const highlightCommunityPicks = writable<boolean>(false);
