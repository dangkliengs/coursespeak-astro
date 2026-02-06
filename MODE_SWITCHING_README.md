# 🚀 CourseSpeak Astro Auto Mode Switcher

**Script untuk development workflow** - memudahkan switch antara dev mode (dengan admin features) dan testing mode (static preview).

**✅ SOLVED**: Script otomatis disable server routes untuk static build! Sekarang bisa deploy ke GitHub Pages.

## 🎯 Purpose (Tujuan Script Ini)

Script ini untuk **full development & deployment workflow**:
- ✅ Mudah switch development mode (dengan admin editing)
- ✅ Production build untuk GitHub Pages (server routes otomatis disabled)
- ✅ Development workflow yang smooth
- ✅ Backup & restore config

**Production deployment**: Sekarang bisa langsung ke GitHub Pages dengan static build!

## 📋 Overview

Project ini memiliki dua mode operasi:

### 🔧 Development Mode (Server)
- **Output**: Server mode dengan `@astrojs/node` adapter
- **Use case**: Development dengan fitur penuh
- **Features**: API routes, dynamic GET functions, admin editing
- **Command**: `npm run dev`

### 🌐 Production Mode (Static)
- **Output**: Static mode
- **Use case**: Production deployment ke GitHub Pages
- **Features**: Server routes otomatis disabled, optimized untuk static hosting
- **Command**: `npm run build && npm run preview`
- **✅ WORKS**: Script otomatis disable server routes untuk static build

## 🛠️ Installation & Setup

Dependencies sudah terinstall secara otomatis:
- `@astrojs/node` untuk server mode
- Config files terpisah: `astro.config.dev.mjs` dan `astro.config.prod.mjs`

## 📊 Commands

### Check Current Mode
```bash
npm run mode:status
# atau
node scripts/auto-switch.js status
```

### Manual Mode Switching

#### Switch to Development Mode
```bash
npm run mode:dev
# atau
node scripts/auto-switch.js dev
```

#### Switch to Production Mode
```bash
npm run mode:prod
# atau
node scripts/auto-switch.js prod
```

### Advanced Commands

#### Auto-Switch Mode
Automatically detects the appropriate mode based on your project structure:
```bash
npm run mode:auto
# atau
node scripts/auto-switch.js auto
```

#### Backup Current Config
```bash
npm run mode:backup
# atau
node scripts/auto-switch.js backup
```

#### Restore from Backup
```bash
npm run mode:restore
# atau
node scripts/auto-switch.js restore
```

## 🔄 Workflow Development

### 1. Development dengan Admin Features
```bash
# Switch ke dev mode
npm run mode:dev

# Jalankan development server
npm run dev

# Buka http://localhost:4321/admin/deals/edit/[id]
# Admin editing akan berfungsi normal
```

### 2. Production Build untuk GitHub Pages (SEKARANG BEKERJA!)
```bash
# Switch ke prod mode - otomatis disable server routes
npm run mode:prod

# Build untuk production - sekarang berhasil!
npm run build  # ✅ SUCCESS: 104 pages built

# Preview hasil build
npm run preview  # ✅ Available di http://localhost:4322

# Deploy ke GitHub Pages
git add .
git commit -m "Production build with auto-disabled server routes"
git push
```

**✅ SOLUTION**: Script otomatis disable server routes saat switch ke production, sehingga bisa build static untuk GitHub Pages!

### 3. Testing Admin Edit Functionality
```bash
# Pastikan dalam development mode
npm run mode:status  # Harus menampilkan "development"

# Jalankan development server
npm run dev

# Buka browser dan test admin edit
# http://localhost:4321/admin/deals/edit/8016

# Test update functionality
# Edit form dan klik "Update Deal"
# Check console untuk success message
```

## 📁 File Structure

```
coursespeak-astro/
├── astro.config.mjs          # Main config (auto-switched)
├── astro.config.dev.mjs      # Development config
├── astro.config.prod.mjs     # Production config
├── scripts/
│   └── auto-switch.js        # Auto switch script
└── package.json              # Scripts defined here
```

## ⚠️ Important Notes

### Development Mode Requirements
- **@astrojs/node** dependency wajib ada
- Digunakan untuk fitur server-side seperti:
  - API routes (`src/pages/api/`)
  - Dynamic GET functions di pages
  - Admin panel editing

### Production Mode Limitations
- Static output only
- Tidak support server-side features
- Optimized untuk GitHub Pages hosting
- Admin editing tidak akan berfungsi

### File Management
- Jangan edit `astro.config.mjs` secara manual
- Gunakan script untuk switch mode
- Config terpisah disimpan di `astro.config.dev.mjs` dan `astro.config.prod.mjs`

## 🐛 Troubleshooting

### Admin Edit Page Issues

#### Error: "Cannot read properties of undefined (reading 'title')"
- **Cause**: Not in development mode or GET function not working
- **Solution**:
  ```bash
  npm run mode:dev   # Switch to development mode
  npm run dev        # Restart dev server
  ```

#### Error: "Deal not found" (404)
- **Cause**: Invalid deal ID or deal doesn't exist
- **Solution**: Check if deal ID exists in `src/data/deals.json`

#### Update fails with API error
- **Cause**: API route not working or server mode issue
- **Solution**:
  ```bash
  npm run mode:status  # Verify development mode
  # Check browser console for detailed error
  ```

### Mode Switching Issues

#### Error: "Cannot read properties of undefined"
- Pastikan dalam **development mode**
- Jalankan `npm run mode:dev` sebelum development

#### Build gagal di production
- **Cause**: Project punya server-side routes (API, admin editing)
- **Solution**:
  - Untuk project ini: **TIDAK BISA build static**
  - Opsi: Remove server routes atau gunakan VPS hosting
  - Alternative: Keep development mode untuk testing

#### Script tidak berfungsi
```bash
# Check current status
npm run mode:status

# Force reinstall dependencies
npm install

# Test script directly
node scripts/auto-switch.js status
```

### Auto-Switch Issues

#### Auto mode doesn't detect correctly
- **Cause**: File structure changed or detection logic issue
- **Solution**: Use manual mode switching:
  ```bash
  npm run mode:dev   # For admin features
  npm run mode:prod  # For production deployment
  ```

## 📝 Usage Examples

### Daily Development Workflow
```bash
# Development dengan admin features
npm run mode:dev && npm run dev
# Work on admin features at http://localhost:4321/admin/deals/edit/[id]

# Production build untuk GitHub Pages
npm run mode:prod && npm run build && npm run preview
# Preview at http://localhost:4322

# Deploy ke GitHub Pages
git add .
git commit -m "Production build - server routes auto-disabled"
git push
```

### Quick Mode Switching
```bash
# Check status
npm run mode:status

# Switch modes quickly
npm run mode:dev   # Development
npm run mode:prod  # Production
```

---

**Created for CourseSpeak Astro project - Auto mode switching made easy! 🎉**