export const NAV_ROUTES = {
  WEBSITE: 'https://degenerousdao.com/',
  TERMS: 'https://degenerousdao.com/legal/terms-of-service',
  SUPPORT: 'mailto:support@degenerousdao.com',
  WIKI: 'https://degenerousdao.gitbook.io/wiki',
  DISCORD: 'https://degenerousdao.com/join',
  TWITTER: (encodedMessage: string, encodedURI: string) =>
    `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedURI}`,
  FACEBOOK: (encodedMessage: string, encodedURI: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodedURI}&quote=${encodedMessage}`,

  HOME: '/dashboard',
  DREAM: '/dashboard/dream',
  CREATE: '/dashboard/dream/create',
  MANAGE: '/dashboard/dream/manage',
  EXPLORE: (topic_id: string) => `/dashboard/dream/manage/${topic_id}`,
  DEMO: '/dashboard/dream/manage/demo',

  FAQ: '/learn/faq',
};
