/**
 * Build verification script.
 * Ensures the build output is valid before deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.argv[2] || 'production';
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log(`\n🔍 Verifying ${mode} build...`);

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist directory not found');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexPath)) {
  console.error('❌ Error: index.html not found in dist');
  process.exit(1);
}

// Check if index.html is not empty
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (indexContent.length < 100) {
  console.error('❌ Error: index.html appears to be invalid or empty');
  process.exit(1);
}

console.log('✅ Build verification passed');
console.log(`📦 Build size: ${(indexContent.length / 1024).toFixed(2)} KB (index.html)\n`);

process.exit(0);
