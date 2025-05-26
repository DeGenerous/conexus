// Type imports
import type { ManifestOptions } from 'vite-plugin-pwa';

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: 'https://conexus.degenerousdao.com', // Change this to your website's base URL.
  title: 'CoNexus - Degenerous DAO', // Change this to your website's title.
  description:
    'CoNexus is the gateway to a boundless multiverse with infinite Choose-Your-Adventure stories.',
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
  name: 'CoNexus',
  short_name: 'CoNexus',
  description:
    'CoNexus is the gateway to a boundless multiverse with infinite Choose-Your-Adventure stories.',
  display: 'fullscreen',
  start_url: '/',
  background_color: '#000000',
  theme_color: '#010020',
  lang: 'en-US',
  orientation: 'any',
  prefer_related_applications: false,
  categories: ['games', 'entertainment', 'education'],
  screenshots: [
    {
      src: 'screenshots/pc-1.webp',
      sizes: '2880x1800',
      type: 'image/webp',
      form_factor: 'wide',
      label: 'Home screen',
    },
    {
      src: 'screenshots/pc-2.webp',
      sizes: '2880x1800',
      type: 'image/webp',
      form_factor: 'wide',
      label: 'Section with stories',
    },
    {
      src: 'screenshots/pc-3.webp',
      sizes: '2880x1800',
      type: 'image/webp',
      form_factor: 'wide',
      label: 'Story page',
    },
    {
      src: 'screenshots/pc-4.webp',
      sizes: '2880x1800',
      type: 'image/webp',
      form_factor: 'wide',
      label: 'Gameplay',
    },
    {
      src: 'screenshots/mobile-1.webp',
      sizes: '591x1131',
      type: 'image/webp',
      form_factor: 'narrow',
      label: 'Home screen',
    },
    {
      src: 'screenshots/mobile-2.webp',
      sizes: '591x1131',
      type: 'image/webp',
      form_factor: 'narrow',
      label: 'Section with stories',
    },
    {
      src: 'screenshots/mobile-3.webp',
      sizes: '591x1131',
      type: 'image/webp',
      form_factor: 'narrow',
      label: 'Story page',
    },
    {
      src: 'screenshots/mobile-4.webp',
      sizes: '591x1131',
      type: 'image/webp',
      form_factor: 'narrow',
      label: 'Gameplay',
    },
  ],
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
      purpose: 'maskable',
    },
  ],
};
