// Type imports
import type { ManifestOptions } from 'vite-plugin-pwa';

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: 'https://conexus.degenerousdao.com', // Change this to your website's base URL.
  title: 'CoNexus - Degenerous DAO', // Change this to your website's title.
  description:
    'CoNexus is a decentralized platform that connects users with the Degenerous DAO, enabling seamless interactions and transactions.',
  type: 'website',
  image: {
    url: 'https://media.degenerousdao.com/logo.png', // Change this to your website's OpenGraph image URL.
    alt: 'CoNexus - Degenerous DAO', // Change this to your website's OpenGraph image alt text.
    width: 1200,
    height: 630,
  },
  siteName: 'CoNexus - Degenerous DAO', // Change this to your website's site name.
  locale: 'en_US', // Change this to your website's locale.
  twitter: {
    card: 'summary_large_image',
  },
};

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: 'CoNexus - Degenerous DAO',
  short_name: 'CoNexus',
  description:
    'A storytelling platform powered by AI and Web3, where your choices shape the multiverse.',
  display: 'fullscreen',
  start_url: "/",
  background_color: '#010020',
  theme_color: '#010020',
  lang: 'en-US',
  orientation: 'any',
  prefer_related_applications: false,
  categories: ['games', 'entertainment', 'education'],
  icons: [
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};
