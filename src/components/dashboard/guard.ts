// dashboard/guards.ts
import { wrap } from 'svelte-spa-router/wrap';
import type { SvelteComponent } from 'svelte';

import { ensureCreator, ensureAdmin } from '@utils/route-guard'; // your role checkers

export function creatorGuard(component: typeof SvelteComponent) {
  let isAdmin = false;
  let isCreator = false;

  ensureCreator().then(({ isAdmin: admin, isCreator: creator }) => {
    isAdmin = admin;
    isCreator = creator;
  });

  return wrap({
    component,
    conditions: [
    ],
    props: {
      isAdmin,
      isCreator,
    },
  });
}

export function adminGuard(component: typeof SvelteComponent) {
  return wrap({
    component,
    conditions: [
      async () => {
        await ensureAdmin(); // throws or redirects if not admin
        return true;
      },
    ],
    props: {
      role: 'admin',
    },
  });
}
