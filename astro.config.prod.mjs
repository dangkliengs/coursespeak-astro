// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [react(), sitemap({
    filter: (page) => {
      if (page.includes('/admin/') || page.includes('/api/')) return false;
      if (page.includes('.amp')) return false;
      // Exclude utility pages that must not be indexed (they carry noindex)
      if (page.match(/\/(search|404)(\/|$)/)) return false;
      if (page.endsWith('/sitemap/') || page.endsWith('/sitemap')) return false;
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