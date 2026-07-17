// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  compressHTML: true,
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  site: 'https://coursespeak.com',
  base: '/'
});