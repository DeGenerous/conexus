import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import Dashboard from './Dashboard.svelte';

export const dashboardHome = wrap({ component: Dashboard });
