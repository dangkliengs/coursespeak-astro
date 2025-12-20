// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: 'https://coursespeak.com',
  base: '/',
  vite: {
    server: {
      fs: {
        // Allow reading files from src/data directory
        allow: ['..']
      }
    }
  }
});