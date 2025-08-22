import type { WrappedComponent } from 'svelte-spa-router';

export const DASHBOARD_PATH = '/dashboard';

export const DASHBOARD_LINKS: Linking[] = [
  {
    name: 'Profile',
    intended: 'all',
    children: [
      { name: 'Overview', path: '/dashboard/profile/overview' },
      { name: 'Settings', path: '/dashboard/profile/settings' },
      { name: 'Metrics', path: '/dashboard/profile/metrics' },
    ],
  },
  {
    name: 'Dream',
    intended: 'creator',
    children: [
      {
        name: 'New',
        intended: 'creator',
        children: [
          { name: 'Create', path: '/dashboard/dream/create' },
          { name: 'Drafts', path: '/dashboard/dream/drafts' },
          { name: 'Demo', path: '/dashboard/dream/demo' },
        ],
      },
      {
        name: 'Manage',
        intended: 'creator',
        children: [
          { name: 'Collections', path: '/dashboard/dream/manage/collections' },
          { name: 'Categories', path: '/dashboard/dream/manage/categories' },
          { name: 'NFT Gates', path: '/dashboard/dream/manage/nft-gates' },
        ],
      },
    ],
  },
  {
    name: 'Admin',
    intended: 'admin',
    children: [
      {
        name: 'Management',
        intended: 'admin',
        children: [
          { name: 'Users', path: '/dashboard/management/users' },
          { name: 'Roles', path: '/dashboard/management/roles' },
          { name: 'Sections', path: '/dashboard/management/sections' },
        ],
      },
      {
        name: 'Web3',
        intended: 'admin',
        children: [
          { name: 'Contracts', path: '/dashboard/web3/contracts' },
          { name: 'Gates', path: '/dashboard/web3/gates' },
        ],
      },

      {
        name: 'Analytics',
        intended: 'admin',
        children: [
          { name: 'Dashboard', path: '/dashboard/analytics/dashboard' },
          { name: 'Reports', path: '/dashboard/analytics/reports' },
        ],
      },
    ],
  },
  {
    name: 'OmniHub',
    path: '/dashboard/omnihub',
  },
];

export function buildRoutes(
  links: Linking[],
  map: Record<string, WrappedComponent>,
): Record<string, WrappedComponent> {
  const routes: Record<string, WrappedComponent> = {};

  function traverse(items: Linking[]) {
    for (const item of items) {
      if (item.path && map[item.path]) {
        routes[item.path] = map[item.path];
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(links);

  return routes;
}
