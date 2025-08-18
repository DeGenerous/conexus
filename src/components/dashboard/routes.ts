import Dashboard from './Dashboard.svelte';

import ProfileSettings from './Profile/Settings.svelte';
import ProfileMetrics from './Profile/Metrics.svelte';

import DreamCreate from './dreaming/new/Create.svelte';
import DreamDraft from './dreaming/new/Draft.svelte';
import DreamDemo from './dreaming/new/Demo.svelte';

import DreamCollections from './dreaming/manage/Collection.svelte';
import DreamCategories from './dreaming/manage/Category.svelte';
import DreamNFTGates from './dreaming/manage/NFTGate.svelte';

// import OmniHub from './OmniHub.svelte';

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

// A mapping of path -> component
const componentMap: Record<string, any> = {
  '/dashboard/profile/settings': ProfileSettings,
  '/dashboard/profile/metrics': ProfileMetrics,

  '/dashboard/dream/create': DreamCreate,
  '/dashboard/dream/drafts': DreamDraft,
  '/dashboard/dream/demo': DreamDemo,

  '/dashboard/dream/manage/collections': DreamCollections,
  '/dashboard/dream/manage/categories': DreamCategories,
  '/dashboard/dream/manage/nft-gates': DreamNFTGates,
  //   '/dashboard/omnihub': OmniHub,
};

export function buildRoutes(links: Linking[], map = componentMap) {
  const routes: Record<string, any> = {};

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

  // fallback
  routes['*'] = Dashboard;

  return routes;
}
