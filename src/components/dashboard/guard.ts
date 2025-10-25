// dashboard/guards.ts
import { wrap } from 'svelte-spa-router/wrap';
import type { SvelteComponent } from 'svelte';

import { checkUserRoles, ensureAdmin } from '@utils/route-guard'; // your role checkers

export function playerGuard(component: typeof SvelteComponent) {
  let isAdmin = false;
  let isPlayer = false;

  checkUserRoles().then(({ isAdmin: admin, isPlayer: player }) => {
    isAdmin = admin;
    isPlayer = player;
  });

  return wrap({
    component,
    conditions: [],
    props: {
      isAdmin,
      isPlayer,
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
