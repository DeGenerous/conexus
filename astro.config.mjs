import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import { VitePWA } from 'vite-plugin-pwa';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';

import { manifest, seoConfig } from './utils/seoConfig';

// https://astro.build/config
export default defineConfig({
  site: seoConfig.baseURL,
  integrations: [svelte(), react(), sitemap(), compress()],
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: '/',
        },
        manifest,
        workbox: {
          globDirectory: 'dist',
          globPatterns: [
            '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
          ],
          // Don't fallback on document based (e.g. `/some-page`) requests
          // This removes an errant console.log message from showing up.
          // navigateFallback: null,
          navigateFallback: '/',
        },
      }),
    ],
    server: {
      proxy: {
        // remove in production
        '/api': {
          target: import.meta.env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
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
