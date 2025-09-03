import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import Home from './Home.svelte';

export const home = wrap({ component: Home });
