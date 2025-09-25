import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'),
      '@components/*': 'src/components/*',
      '@errors/*': 'src/errors/*',
      '@layouts/*': 'src/layouts/*',
      '@lib/*': 'src/lib/*',
      '@constants/*': 'src/constants/*',
      '@service/*': 'src/service/*',
      '@stores/*': 'src/stores/*',
      '@styles/*': 'src/styles/*',
      '@utils/*': 'src/utils/*',
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
