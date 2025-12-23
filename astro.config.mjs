// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://coursespeak.com',
  base: '/',
  build: {
    format: 'file'
  },
  vite: {
    server: {
      fs: {
        // Allow reading files from src/data directory
        allow: ['..']
      }
    }
  }
});