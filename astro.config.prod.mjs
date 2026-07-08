// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  compressHTML: true,
  integrations: [react(), sitemap({
    filter: (page) => {
      if (page.includes('/admin/') || page.includes('/api/')) return false;
      if (page.includes('.amp')) return false;
      const match = page.match(/\/deal\/([^\/]+)/);
      if (match && !/^\d+$/.test(match[1])) return false;
      return true;
    },
    changefreq: 'daily',
    priority: 0.7,
    lastmod: new Date(),
  })],
  site: 'https://coursespeak.com',
  base: '/'
});