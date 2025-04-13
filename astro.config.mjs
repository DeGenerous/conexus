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
      
      allowedHosts: ['conexus.degenerousdao.com', 'conexus-test.degenerousdao.com'],
    },
  },
  devToolbar: {
    enabled: false,
  },
});
