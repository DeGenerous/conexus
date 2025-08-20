import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import AdminANalyticsDashboard from './analytics/Dashboard.svelte';
import AdminANalyticsReport from './analytics/Report.svelte';

import AdminManagementUser from './management/User.svelte';
import AdminManagementRole from './management/Role.svelte';
import AdminManagementSection from './management/Section.svelte';

import AdminWeb3Contract from './web3/Contract.svelte';
import AdminWeb3Gate from './web3/Gate.svelte';

export const adminRoutes = {
  '/dashboard/web3/contracts': wrap({
    component: AdminWeb3Contract as unknown as typeof SvelteComponent,
  }),
  '/dashboard/web3/gates': wrap({
    component: AdminWeb3Gate as unknown as typeof SvelteComponent,
  }),
  '/dashboard/management/users': wrap({
    component: AdminManagementUser as unknown as typeof SvelteComponent,
  }),
  '/dashboard/management/roles': wrap({
    component: AdminManagementRole as unknown as typeof SvelteComponent,
  }),
  '/dashboard/management/sections': wrap({
    component: AdminManagementSection as unknown as typeof SvelteComponent,
  }),
  '/dashboard/analytics/dashboard': wrap({
    component: AdminANalyticsDashboard as unknown as typeof SvelteComponent,
  }),
  '/dashboard/analytics/reports': wrap({
    component: AdminANalyticsReport as unknown as typeof SvelteComponent,
  }),
};
