# GitHub Deployment Troubleshooting Guide

## 🚨 Common GitHub Deployment Issues

### 1. Build Failed
**Error**: `Build failed` or `Exit code 1`
**Causes**:
- Node adapter installed (not compatible with GitHub Pages)
- API routes present with `prerender = false`
- TypeScript errors in astro.config.mjs

**Solutions**:
```bash
# Remove Node adapter
npm uninstall @astrojs/node

# Remove API routes
rm -rf src/pages/api

# Fix astro.config.mjs
output: 'static'  # No adapter
```

### 2. 404 Errors
**Error**: Pages return 404
**Causes**:
- Wrong base path in astro.config.mjs
- Missing getStaticPaths() in dynamic routes
- Incorrect GitHub Pages settings

**Solutions**:
```javascript
// astro.config.mjs
base: '/'  // Must be root for coursespeak.com
```

```astro
// Dynamic routes need getStaticPaths()
export async function getStaticPaths() {
  const allDeals = await readDeals();
  return allDeals.map(deal => ({
    params: { id: deal.id },
    props: { deal }
  }));
}
```

### 3. GitHub Pages Settings Wrong
**Error**: Deployed to wrong branch or folder
**Solutions**:
1. Go to Repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)

### 4. Asset Loading Issues
**Error**: CSS/JS not loading, broken theme
**Causes**: Wrong base path configuration
**Solutions**:
```javascript
// astro.config.mjs
site: 'https://coursespeak.com'
base: '/'  // NOT '/coursespeak-astro/'
```

## 🔧 Quick Fix Commands

### Emergency Reset to Working State:
```bash
# Reset to known working commit
git log --oneline -10
git reset --hard <working-commit-hash>

# Remove problematic files
rm -rf src/pages/api
npm uninstall @astrojs/node @astrojs/vercel

# Build and test
npm run build
```

### Force Clean Build:
```bash
# Clean everything
rm -rf dist node_modules
npm install
npm run build
```

## 📋 Pre-Push Checklist

Before pushing to GitHub:

- [ ] astro.config.mjs has `output: 'static'`
- [ ] No adapter installed (uninstall @astrojs/node)
- [ ] No API routes in src/pages/api/
- [ ] All dynamic routes have getStaticPaths()
- [ ] base: '/' in astro.config.mjs
- [ ] site: 'https://coursespeak.com'
- [ ] Local build successful: `npm run build`
- [ ] Test with preview: `npm run preview`

## 🚀 Recovery Steps

If deployment fails:

1. **Check GitHub Actions**
   - Go to repository → Actions tab
   - Look for build errors in logs

2. **Check GitHub Pages**
   - Repository → Settings → Pages
   - Verify deployment status

3. **Local Testing**
   ```bash
   npm run build
   npm run preview
   ```

4. **Incremental Fix**
   - Fix one issue at a time
   - Test locally before pushing
   - Commit small changes

## 🆘 Emergency Contacts

If all else fails:
1. **Rollback**: `git reset --hard HEAD~1`
2. **Clean build**: Remove node_modules, reinstall
3. **Minimal config**: Use basic astro.config.mjs
4. **Manual deploy**: Upload dist/ folder manually

## 📝 Recent Working Config

```javascript
// astro.config.mjs (Working Version)
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: 'https://coursespeak.com',
  base: '/'
});
```

**Key points**: No adapter, pure static, correct base path.
