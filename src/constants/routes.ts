export const NAV_ROUTES = {
  // General links
  MEDIA: 'https://media.dgrslabs.ink',
  LOGO: 'https://media.dgrslabs.ink/assets/logo.png',
  CONEXUS: 'https://conexus.ink',
  WEBSITE: 'https://dgrslabs.ink/',
  GOVERNANCE_HUB: 'https://governance.dgrslabs.ink',
  LOREDEX: 'https://loredex.dgrslabs.ink',
  SUPPORT: 'mailto:contact@conexus.ink',
  WIKI: 'https://degenerousdao.gitbook.io/wiki',
  DISCORD: 'https://dgrslabs.ink/join',
  TWITTER: (encodedMessage: string, encodedURI: string) =>
    `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedURI}`,
  FACEBOOK: (encodedMessage: string, encodedURI: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodedURI}&quote=${encodedMessage}`,
  MAGIC_EDEN: 'https://magiceden.io/collections/ethereum/potentials-eth',
  OPENSEA: 'https://opensea.io/collection/potentials-eth',
  SINGULAR:
    'https://singular.app/collectibles/base/0x111e0861baa9d479cff55d542e5a9e4205012bbe',
  // Legal
  TERMS: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',
  COPYRIGHT_POLICY: '/copyright-policy',
  CONTRIBUTOR_LICENSE: '/contributors-license-agreement',
  CONTENT_POLICY: '/content-policy',
  // CoNexus routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/account',
  BOOKMARKS: '/dashboard/bookmarks',
  SETTINGS: '/dashboard/settings',
  FAQ: '/learn/faq',
  BLOG: '/learn/blog',
  DREAM: '/dream',
  MANAGE: '/dashboard/collections',
  OMNIHUB: '/dashboard/omnihub',
  ADMIN_USERS: '/admin/users',
  ADMIN_STORIES: '/admin/stories',
  ADMIN_WEB3: '/admin/web3',
  EXPLORE: (topic_id: string) => `/dashboard/collections/topic/${topic_id}`,
};
