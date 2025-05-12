import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import { VitePWA } from 'vite-plugin-pwa';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

import { manifest, seoConfig } from './utils/seoConfig';

import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  site: seoConfig.baseURL,
  integrations: [svelte(), react(), sitemap()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        injectRegister: 'auto',
        workbox: {
          runtimeCaching: [
            {
              handler: 'NetworkOnly',
              urlPattern: /\/api\/.*\/*.json/,
              method: 'POST',
              options: {
                backgroundSync: {
                  name: 'myQueueName',
                  options: {
                    maxRetentionTime: 24 * 60,
                  },
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
          // globDirectory: 'dist',
          // globPatterns: [
          //   '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
          // ],
          // // Don't fallback on document based (e.g. `/some-page`) requests
          // // This removes an errant console.log message from showing up.
          // // navigateFallback: null,
          // navigateFallback: '/',
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: '/',
        },
      }),
    ],
    server: {
      // proxy: {
      //   // remove in production
      //   '/api': {
      //     target: import.meta.env.VITE_API_URL,
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
      proxy:
        import.meta.env.NODE_ENV !== 'production'
          ? {
              '/api': {
                target: import.meta.env.VITE_API_URL,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
            }
          : undefined,
      allowedHosts: [
        'conexus.degenerousdao.com',
        'conexus-test.degenerousdao.com',
      ],
    },
  },
  devToolbar: {
    enabled: false,
  },
});
