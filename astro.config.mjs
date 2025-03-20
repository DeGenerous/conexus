import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), react()],
  output: 'server',
  adapter: vercel(),
  vite: {
    server: {
      proxy: { // remove in production
        '/api': {
          target: import.meta.env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      allowedHosts: ['conexus-v1-test.degenerousdao.com'],
    },
  },
  devToolbar: {
    enabled: false,
  },
});
