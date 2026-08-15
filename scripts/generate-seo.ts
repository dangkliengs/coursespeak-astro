#!/usr/bin/env node
/**
 * Backfill script for SEO descriptions.
 * Replaces stale "This is applicable to ... Udemy discount offers" templates
 * (and empty seoDescription fields) with the varied, data-driven generator
 * from src/lib/verdict.ts.
 *
 * Usage: node scripts/generate-seo.ts
 * Safe: only touches deals whose description matches the old template.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSeoDescription } from '../src/lib/verdict.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEALS_FILE = path.join(__dirname, '..', 'src', 'data', 'deals.json');

function isTemplateDescription(desc?: string): boolean {
  return !desc || /this is applicable to/i.test(desc);
}

const raw = fs.readFileSync(DEALS_FILE, 'utf-8');
const deals = JSON.parse(raw.replace(/^\uFEFF/, ''));

let updated = 0;
let skipped = 0;

for (const deal of deals) {
  if (isTemplateDescription(deal.seoDescription)) {
    deal.seoDescription = buildSeoDescription(deal);
    deal.seoTitle = deal.seoTitle || deal.title;
    updated++;
  } else {
    skipped++;
  }
}

fs.writeFileSync(DEALS_FILE, JSON.stringify(deals, null, 2), 'utf-8');
console.log(`Done. Updated ${updated} deals, skipped ${skipped} custom descriptions.`);
console.log('Sample new description:');
const sample = deals[0];
console.log(`  - ${sample.title}`);
console.log(`    ${sample.seoDescription}`);