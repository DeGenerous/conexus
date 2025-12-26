// dashboard/guards.ts
import { wrap } from 'svelte-spa-router/wrap';
import type { SvelteComponent } from 'svelte';

import { checkUserRoles, redirectTo } from '@utils/route-guard';

const DASHBOARD_FALLBACK = '/dashboard';

export function playerGuard(component: typeof SvelteComponent) {
  return wrap({
    component,
    conditions: [
      async () => {
        const { isAdmin, isPlayer } = await checkUserRoles(DASHBOARD_FALLBACK);
        const allowed = isAdmin || isPlayer;

        if (!allowed) {
          redirectTo(DASHBOARD_FALLBACK);
        }

        return allowed;
      },
    ],
  });
}

export function adminGuard(component: typeof SvelteComponent) {
  return wrap({
    component,
    conditions: [
      async () => {
        const { isAdmin } = await checkUserRoles(DASHBOARD_FALLBACK);

        if (!isAdmin) {
          redirectTo(DASHBOARD_FALLBACK);
        }

        return isAdmin;
      },
    ],
  });
}
