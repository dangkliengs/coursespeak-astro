# CourseSpeak - Udemy Course Deals Platform

A modern Astro-based platform for discovering and managing Udemy course deals with admin panel functionality.

## 🚀 Features

- **Course Discovery**: Browse 881+ Udemy courses with deals
- **Category Filtering**: Filter by IT & Software, Development, Business, etc.
- **Admin Panel**: Full CRUD operations for course management
- **GitHub API Integration**: Update deals directly via GitHub API
- **Rich Text Editor**: WYSIWYG content editing
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Structured data and meta tags
- **Static Generation**: Fast loading with Astro SSG

## 🛠️ Tech Stack

- **Framework**: Astro 5.16.6
- **UI**: React components
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages
- **API**: GitHub API + Local API fallback

## 📁 Project Structure

```text
/
├── public/
│   ├── images/
│   └── brands/
├── src/
│   ├── components/
│   │   ├── GitHubAuth.astro
│   │   ├── AdminProtection.astro
│   │   └── ...
│   ├── data/
│   │   └── deals.json (881 courses)
│   ├── lib/
│   │   ├── store.ts
│   │   └── github-api.js
│   ├── pages/
│   │   ├── admin/
│   │   │   └── deals/
│   │   │       └── edit/[id].astro
│   │   ├── deal/[id].astro
│   │   ├── deals/[page].astro
│   │   └── ...
│   └── layouts/
│       └── Layout.astro
├── astro.config.mjs
└── package.json
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build production site to `./dist/`              |
| `npm run preview`         | Preview build locally                             |

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- GitHub Personal Access Token (for admin features)

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access admin panel: `http://localhost:4321/admin/deals`

### Admin Panel Features
- **GitHub Authentication**: Enter your GitHub token
- **Course Management**: Add, edit, delete courses
- **Rich Text Editing**: WYSIWYG content editor
- **API Integration**: GitHub API + Local API fallback

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### GitHub Pages
1. Build project: `npm run build`
2. Deploy `dist/client/` to GitHub Pages
3. Configure GitHub Pages settings to root directory

### Mode Configuration
- **Development**: API routes enabled, GitHub integration active
- **Production**: Static build, API routes disabled

## 📊 Statistics

- **Total Courses**: 881
- **Categories**: 12 main categories
- **Pages Generated**: 74+ static pages
- **Build Time**: ~25 seconds

## 🔐 Admin Authentication

For development:
1. Generate GitHub Personal Access Token
2. Navigate to `/admin/deals/edit/[id]`
3. Enter token in GitHub Auth form
4. Full admin functionality available

For production:
- Admin panel read-only (GitHub Pages limitations)
- Manual updates via GitHub repository

## 🌐 Live Site

**Production**: https://coursespeak.com

## 📝 License

MIT License - see LICENSE file for details
