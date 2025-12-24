# CourseSpeak Mode Switching Manual

## CURRENT STATUS: DEVELOPMENT MODE 
- API routes active (save, update, delete) 
- Node adapter installed
- Admin panel working
- Development server running
- Update functionality confirmed working

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
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  site: 'https://coursespeak.com',
  base: '/'
});
```

### Step 2: Restore API Routes
```bash
# Restore API folder from git
git checkout HEAD -- src/pages/api/
```

### Step 3: Add prerender = false
Add this line to ALL API files:
```javascript
export const prerender = false;
```

Files to edit:
- `src/pages/api/update.js`
- `src/pages/api/save-deal.js`  
- `src/pages/api/delete-deal.js`
- `src/pages/api/deals.js`

### Step 4: Start Development Server
```bash
npm run dev
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

---

## FUNCTIONALITY STATUS

### Update Functionality: WORKING
- Form submission sends JSON correctly
- API endpoint processes updates
- Data syncs to deals.json
- No authentication issues (simple auth check)

### Common Problems & Solutions:
1. **Form not submitting**: Check browser console for JavaScript errors
2. **Data not saving**: Verify API endpoint is accessible
3. **Empty request body**: Check form data serialization

---

## NOTES

- **No API KEY required**: System uses file-based storage
- **Development mode**: Full functionality with API routes
- **Production mode**: Static build only (no API routes)
- **GitHub Pages**: Cannot run server-side functions

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