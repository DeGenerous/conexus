import type { WrappedComponent } from 'svelte-spa-router';

export const DASHBOARD_LINKS: Linking[] = [
  {
    name: 'Profile',
    intended: 'all',
    children: [
      { name: 'Settings', path: '/dashboard/profile/settings' },
      { name: 'Metrics', path: '/dashboard/profile/metrics' },
    ],
  },
  {
    name: 'Dream',
    intended: 'admin & creator',
    children: [
      {
        name: 'New',
        intended: 'admin & creator',
        children: [
          { name: 'Create', path: '/dashboard/dream/create' },
          { name: 'Drafts', path: '/dashboard/dream/drafts' },
          { name: 'Demo', path: '/dashboard/dream/demo' },
        ],
      },
      {
        name: 'Manage',
        intended: 'admin & creator',
        children: [
          { name: 'Collections', path: '/dashboard/dream/manage/collections' },
          { name: 'Categories', path: '/dashboard/dream/manage/categories' },
          { name: 'NFT Gates', path: '/dashboard/dream/manage/nft-gates' },
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
