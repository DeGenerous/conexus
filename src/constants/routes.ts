export const NAV_ROUTES = {
  // General links
  MEDIA: 'https://media.dgrslabs.ink',
  LOGO: 'https://media.dgrslabs.ink/assets/logo.png',
  CONEXUS: 'https://conexus.degenerousdao.com',
  WEBSITE: 'https://dgrslabs.ink/',
  GOVERNANCE_HUB: 'https://governance.dgrslabs.ink',
  LOREDEX: 'https://loredex.dgrslabs.ink',
  TERMS: 'https://dgrslabs.ink/terms-of-service',
  SUPPORT: 'mailto:support@dgrslabs.ink',
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
  // CoNexus routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard#/profile/overview',
  BOOKMARKS: '/dashboard#/profile/bookmarks',
  FAQ: '/learn/faq',
  BLOG: '/learn/blog',
  MANAGE: '/dashboard#/dream/manage/collections',
  OMNIHUB: `/dashboard#/omnihub`,
  EXPLORE: (topic_id: string) => `/dashboard/topic/${topic_id}`,
};
