# CourseSpeak - Sync & Deployment Guide

## Sync Problem (Admin Panel)

### Root Cause:
- API update.js menggunakan hardcoded path: [src/data/deals.json](cci:7://file:///d:/web/coursespeak-astro/src/data/deals.json:0:0-0:0)
- Dashboard store.ts menggunakan dynamic path dengan [resolveDealsFilePath()](cci:1://file:///d:/web/coursespeak-astro/src/lib/store.ts:6:0-16:1)

### Fix:
- Ubah API update.js untuk import [updateDeal](cci:1://file:///d:/web/coursespeak-astro/src/lib/store.ts:79:0-110:1) dari [store.ts](cci:7://file:///d:/web/coursespeak-astro/src/lib/store.ts:0:0-0:0)
- Pastikan API dan Dashboard pakai functions yang sama

### Test:
- Edit post di admin panel localhost:4321
- Cek apakah deals.json berubah

## GitHub Pages 404 Problem

### Root Cause:
- Node adapter terinstall (tidak compatible GitHub Pages)
- API routes ada di src/pages/api/ (static only)
- Config astro.config.mjs masih ada adapter

### Fix Steps:
1. Hapus API routes:
   ```bash
   Remove-Item -Path "src\pages\api" -Recurse -Force
   ```

2. Uninstall Node adapter:
   ```bash
   npm uninstall @astrojs/node
   ```

3. Edit astro.config.mjs:
   ```javascript
   // @ts-check
   import { defineConfig } from 'astro/config';
   import react from '@astrojs/react';

   export default defineConfig({
     output: 'static',
     integrations: [react()],
     site: 'https://coursespeak.com',
     base: '/'
   });
   ```

4. Build test:
   ```bash
   npm run build
   ```

5. Push ke GitHub:
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment"
   git push origin main
   ```

## Development vs Production Mode

### Development Mode (Local):
- Port 4321 (dengan Node adapter)
- API routes enabled
- Admin panel working
- npm run dev

### Production Mode (GitHub Pages):
- Static build only
- No API routes
- No server-side functions
- npm run build

### Mode Switching:
TO DEVELOPMENT:
1. Install Node adapter: npm install @astrojs/node
2. Add adapter ke astro.config.mjs
3. Restore API routes folder
4. npm run dev

TO PRODUCTION:
1. Remove API routes folder
2. Uninstall Node adapter
3. Remove adapter dari astro.config.mjs
4. npm run build
5. Push ke GitHub

## Quick Troubleshooting

### Admin Panel Not Syncing:
1. Cek API update.js pakai store.ts functions
2. Test dengan post yang ada di database
3. Cek console logs untuk API calls
4. Verify file deals.json berubah

### GitHub Pages 404:
1. Pastikan tidak ada API routes
2. Pastikan tidak ada Node adapter
3. Check astro.config.mjs: output: 'static'
4. Verify GitHub Pages settings

### Build Errors:
1. npm run build untuk test local
2. Cek error logs di console
3. Fix TypeScript errors
4. Remove problematic dependencies

## Emergency Recovery

### Rollback to Working:
```bash
git log --oneline -10
git reset --hard <working-commit-hash>
```

### Clean Build:
```bash
rm -rf dist node_modules
npm install
npm run build
```

## Important Notes

- **Jangan edit deals.json manual** - Gunakan API/store functions
- **API routes hanya untuk development** - Production static only
- **GitHub Pages = static only** - Tidak support server-side
- **Selalu test build sebelum push** - `npm run build`
- **Check GitHub Actions** - Untuk build error logs
- **Port development** - localhost:4321 (bukan 4322)

## Mode Switching Commands

### TO DEVELOPMENT MODE:
```bash
# Install Node adapter
npm install @astrojs/node

# Add to astro.config.mjs:
import node from '@astrojs/node';
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  site: 'https://coursespeak.com',
  base: '/'
});

# Create API routes folder
mkdir src/pages/api

# Add API files (update.js, deals.js, etc.)
# Add export const prerender = false; to all API files

# Run development
npm run dev
```

### TO PRODUCTION MODE:
```bash
# Remove API routes
Remove-Item -Path "src\pages\api" -Recurse -Force

# Uninstall Node adapter
npm uninstall @astrojs/node

# Remove adapter from astro.config.mjs
# Keep only: output: 'static', integrations: [react()]

# Build and deploy
npm run build
git add .
git commit -m "Production deployment"
git push origin main
```

## Final Checklist

Before ANY push to GitHub:
- [ ] No API routes folder
- [ ] No Node adapter installed
- [ ] astro.config.mjs: output: 'static' only
- [ ] npm run build successful
- [ ] All links working in preview
- [ ] GitHub Pages settings correct

## Emergency Contacts

If all else fails:
1. **Rollback**: `git reset --hard HEAD~1`
2. **Clean build**: Remove node_modules, reinstall
3. **Minimal config**: Use basic astro.config.mjs
4. **Manual deploy**: Upload dist/ folder manually