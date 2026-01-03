#!/usr/bin/env node

/**
 * Auto Switch Mode Script for CourseSpeak Astro
 * Switches between development (server) and production (static) modes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_DEV = path.join(__dirname, '..', 'astro.config.dev.mjs');
const CONFIG_PROD = path.join(__dirname, '..', 'astro.config.prod.mjs');
const CONFIG_MAIN = path.join(__dirname, '..', 'astro.config.mjs');
const CONFIG_BACKUP = path.join(__dirname, '..', 'astro.config.backup.mjs');

// Server routes that need to be disabled in production
// Note: deal/[id].astro should be available in production as public pages
const SERVER_ROUTES = [
  'src/pages/api/update.js',
  'src/pages/admin/deals/edit/[id].astro',
  'src/pages/admin/deals/create.astro',
  'src/pages/admin.astro',
  'src/pages/admin/deals.astro',
  'src/pages/test/[slug].astro'
];

function getCurrentMode() {
  try {
    const configContent = fs.readFileSync(CONFIG_MAIN, 'utf8');

    if (configContent.includes("output: 'server'")) {
      return 'development';
    } else if (configContent.includes("output: 'static'")) {
      return 'production';
    } else {
      return 'unknown';
    }
  } catch (error) {
    console.error('Error reading current config:', error.message);
    return 'unknown';
  }
}

function disableServerRoutes() {
  console.log('🔧 Disabling server routes for static deployment...');
  SERVER_ROUTES.forEach(route => {
    const routePath = path.join(__dirname, '..', route);
    const disabledPath = routePath + '.disabled';

    try {
      if (fs.existsSync(routePath)) {
        fs.renameSync(routePath, disabledPath);
        console.log(`   📁 Disabled: ${route}`);
      }
    } catch (error) {
      console.warn(`   ⚠️  Could not disable ${route}:`, error.message);
    }
  });
}

function enableServerRoutes() {
  console.log('🔧 Enabling server routes for development...');
  SERVER_ROUTES.forEach(route => {
    const routePath = path.join(__dirname, '..', route);
    const disabledPath = routePath + '.disabled';

    try {
      if (fs.existsSync(disabledPath)) {
        fs.renameSync(disabledPath, routePath);
        console.log(`   📁 Enabled: ${route}`);
      }
    } catch (error) {
      console.warn(`   ⚠️  Could not enable ${route}:`, error.message);
    }
  });
}

function switchToDev() {
  try {
    console.log('🔄 Switching to DEVELOPMENT MODE (Server)...');

    // Enable server routes first
    enableServerRoutes();

    // Copy dev config to main config
    const devConfig = fs.readFileSync(CONFIG_DEV, 'utf8');
    fs.writeFileSync(CONFIG_MAIN, devConfig);

    console.log('✅ Successfully switched to development mode');
    console.log('📝 Current mode: Server mode with @astrojs/node adapter');
    console.log('🚀 Run: npm run dev');
    console.log('🔧 Supports: API routes, dynamic GET functions, admin editing');

  } catch (error) {
    console.error('❌ Error switching to dev mode:', error.message);
    process.exit(1);
  }
}

function switchToProd() {
  try {
    console.log('🔄 Switching to PRODUCTION MODE (Static)...');

    // Disable server routes first
    disableServerRoutes();

    // Copy prod config to main config
    const prodConfig = fs.readFileSync(CONFIG_PROD, 'utf8');
    fs.writeFileSync(CONFIG_MAIN, prodConfig);

    console.log('✅ Successfully switched to production mode');
    console.log('📝 Current mode: Static mode for GitHub Pages');
    console.log('🚀 Run: npm run build && npm run preview');
    console.log('🔧 Optimized for: Static hosting, fast loading');
    console.log('⚠️  Note: Admin features disabled in production');

  } catch (error) {
    console.error('❌ Error switching to prod mode:', error.message);
    process.exit(1);
  }
}

function showStatus() {
  const currentMode = getCurrentMode();
  console.log('📊 Current Astro Mode Status:');
  console.log(`   Mode: ${currentMode.toUpperCase()}`);

  if (currentMode === 'development') {
    console.log('   Output: Server');
    console.log('   Adapter: @astrojs/node');
    console.log('   Use case: Development with full features');
  } else if (currentMode === 'production') {
    console.log('   Output: Static');
    console.log('   Adapter: None');
    console.log('   Use case: Production deployment');
  } else {
    console.log('   Status: Unknown configuration');
  }
}

function autoSwitch() {
  try {
    console.log('🔍 Auto-detecting appropriate mode...');

    // Check if API routes exist (indicates need for server mode)
    const apiDir = path.join(__dirname, '..', 'src', 'pages', 'api');
    const hasApiRoutes = fs.existsSync(apiDir);

    // Check if admin edit functionality exists
    const editPage = path.join(__dirname, '..', 'src', 'pages', 'admin', 'deals', 'edit', '[id].astro');
    const hasAdminEdit = fs.existsSync(editPage);

    if (hasApiRoutes || hasAdminEdit) {
      console.log('📋 Detected admin/API functionality - switching to development mode');
      switchToDev();
    } else {
      console.log('📋 No server-side functionality detected - switching to production mode');
      switchToProd();
    }
  } catch (error) {
    console.error('❌ Error in auto-switch:', error.message);
    process.exit(1);
  }
}

function createBackup() {
  try {
    console.log('💾 Creating backup of current config...');

    if (!fs.existsSync(CONFIG_MAIN)) {
      console.error('❌ Main config file does not exist');
      process.exit(1);
    }

    const configContent = fs.readFileSync(CONFIG_MAIN, 'utf8');
    fs.writeFileSync(CONFIG_BACKUP, configContent);

    console.log('✅ Backup created successfully');
    console.log(`   Backup location: ${CONFIG_BACKUP}`);

  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    process.exit(1);
  }
}

function restoreBackup() {
  try {
    console.log('🔄 Restoring from backup...');

    if (!fs.existsSync(CONFIG_BACKUP)) {
      console.error('❌ Backup file does not exist');
      process.exit(1);
    }

    const backupContent = fs.readFileSync(CONFIG_BACKUP, 'utf8');
    fs.writeFileSync(CONFIG_MAIN, backupContent);

    // Re-enable server routes if restoring to dev mode
    if (backupContent.includes("output: 'server'")) {
      enableServerRoutes();
    }

    console.log('✅ Config restored from backup successfully');

  } catch (error) {
    console.error('❌ Error restoring backup:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🚀 CourseSpeak Astro Mode Switcher

USAGE:
  node scripts/auto-switch.js [command]

COMMANDS:
  dev       Switch to development mode (server + admin features)
  prod      Switch to production mode (static - admin disabled)
  status    Show current mode status
  auto      Auto-detect and switch to appropriate mode
  backup    Create backup of current config
  restore   Restore from backup
  help      Show this help message

EXAMPLES:
  node scripts/auto-switch.js dev     # Development with admin editing
  node scripts/auto-switch.js prod    # Production for GitHub Pages
  node scripts/auto-switch.js status  # Check current mode
  node scripts/auto-switch.js auto    # Auto-switch based on environment

DEVELOPMENT MODE:
- Server output with @astrojs/node
- Admin routes ENABLED (API, edit pages)
- Supports full admin functionality
- Run: npm run dev

PRODUCTION MODE:
- Static output for GitHub Pages
- Admin routes DISABLED (renamed to .disabled)
- Public pages only
- Run: npm run build && npm run preview

AUTO MODE:
- Detects if admin editing is needed
- Switches to dev mode if API routes exist
- Switches to prod mode for static deployment
  `);
}

// Main logic
const command = process.argv[2];

switch (command) {
  case 'dev':
    switchToDev();
    break;
  case 'prod':
    switchToProd();
    break;
  case 'status':
    showStatus();
    break;
  case 'auto':
    autoSwitch();
    break;
  case 'backup':
    createBackup();
    break;
  case 'restore':
    restoreBackup();
    break;
  case 'help':
  case undefined:
    showHelp();
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "node scripts/auto-switch.js help" for usage');
    process.exit(1);
}