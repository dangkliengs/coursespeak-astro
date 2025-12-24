# CourseSpeak Mode Switching Manual

## CURRENT STATUS: DEVELOPMENT MODE
- API routes active (save, update, delete)
- Node adapter installed
- Admin panel working
- Development server running

---

## SWITCH TO PRODUCTION MODE (GitHub Pages)

### Step 1: Remove API Routes
```bash
# Delete entire API folder
rm -rf src/pages/api/
```

### Step 2: Remove Adapter from astro.config.mjs
```javascript
// astro.config.mjs (FINAL VERSION)
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: 'https://coursespeak.com',
  base: '/'
});
```
**Remove these lines:**
- `import node from '@astrojs/node';`
- `adapter: node({ mode: 'standalone' })`

### Step 3: Verify Static Routes
Ensure these files have `getStaticPaths()`:
- `src/pages/categories/[category].astro`
- `src/pages/deals/[page].astro`

### Step 4: Build and Deploy
```bash
npm run build
git add .
git commit -m "Switch to production mode for GitHub Pages"
git push
```

---

## SWITCH TO DEVELOPMENT MODE

### Step 1: Add Adapter
```javascript
// astro.config.mjs (DEV VERSION)
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
  base: '/'
});
```

### Step 2: Create API Routes
```bash
mkdir src/pages/api
# Create these files with prerender = false:
# - src/pages/api/deals.js
# - src/pages/api/save-deal.js  
# - src/pages/api/update.js
# - src/pages/api/delete-deal.js
```

### Step 3: Start Development
```bash
npm run dev
```

---

## QUICK REFERENCE

**Development Commands:**
- `npm run dev` - Start dev server
- Admin: `http://localhost:4323/admin`

**Production Commands:**
- `npm run build` - Build static site
- `git push` - Deploy to GitHub Pages

**Key Differences:**
- Development: API routes + adapter + admin panel
- Production: Static only + no API routes + GitHub Pages

**Card Links (Always Same):**
- Title → `/deal/[id]` (internal post)
- Get Deal → Udemy URL (external)

---

## API ROUTES TEMPLATES

### src/pages/api/deals.js
```javascript
export const prerender = false;
import { promises as fs } from 'fs';
import path from 'path';

const DEALS_FILE = path.join(process.cwd(), 'src', 'data', 'deals.json');

export async function GET() {
  try {
    const data = await fs.readFile(DEALS_FILE, 'utf-8');
    const deals = JSON.parse(data);
    return new Response(JSON.stringify(deals), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### src/pages/api/save-deal.js
```javascript
export const prerender = false;
import { promises as fs } from 'fs';
import path from 'path';

const DEALS_FILE = path.join(process.cwd(), 'src', 'data', 'deals.json');

export async function POST({ request }) {
  try {
    const dealData = await request.json();
    
    if (!dealData.title || dealData.price === undefined || dealData.price === null) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let currentDeals = [];
    try {
      const data = await fs.readFile(DEALS_FILE, 'utf-8');
      currentDeals = JSON.parse(data);
    } catch (error) {
      console.log('Starting with empty deals file');
    }
    
    dealData.id = Date.now().toString();
    dealData.createdAt = new Date().toISOString();
    dealData.updatedAt = new Date().toISOString();
    
    currentDeals.unshift(dealData);
    
    await fs.mkdir(path.dirname(DEALS_FILE), { recursive: true });
    await fs.writeFile(DEALS_FILE, JSON.stringify(currentDeals, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ success: true, deal: dealData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

---

## TROUBLESHOOTING

**Common Issues:**
1. **API routes not working**: Check `export const prerender = false;` is present
2. **Build fails**: Remove API routes folder before production build
3. **404 errors**: Ensure all dynamic routes have `getStaticPaths()` for production
4. **Admin panel not accessible**: Check adapter is installed for development mode

**Quick Test:**
- Development: Visit `http://localhost:4323/admin`
- Production: Visit `https://coursespeak.com` after deployment