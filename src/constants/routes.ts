export const NAV_ROUTES = {
  CONEXUS: 'https://conexus.ink',
  WEBSITE: 'https://dgrslabs.ink/',
  TERMS: 'https://dgrslabs.ink/terms-of-service',
  SUPPORT: 'mailto:support@dgrslabs.ink',
  WIKI: 'https://degenerousdao.gitbook.io/wiki',
  DISCORD: 'https://dgrslabs.ink/join',
  TWITTER: (encodedMessage: string, encodedURI: string) =>
    `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedURI}`,
  FACEBOOK: (encodedMessage: string, encodedURI: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodedURI}&quote=${encodedMessage}`,

  // TODO: Deprecate these routes
  HOME: '/dashboard',
  DREAM: '/dashboard/dream',
  CREATE: '/dashboard/dream/create',
  MANAGE: '/dashboard/dream/manage',
  EXPLORE: (topic_id: string) => `/dashboard/dream/manage/${topic_id}`,
  DEMO: '/dashboard/dream/manage/demo',

  FAQ: '/learn/faq',
  BLOG: '/learn/blog',
};
