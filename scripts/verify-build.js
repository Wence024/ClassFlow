/**
 * Build verification script to ensure correct Supabase environment is embedded.
 * Run after build to validate the built files contain the expected project ID.
 * 
 * Usage: node scripts/verify-build.js [environment]
 * Example: node scripts/verify-build.js production
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.argv[2] || 'production';
const expectedEnvs = {
  development: 'wkfgcroybuuefaulqsru',
  staging: 'pnmzjmcfeekculqyirpr',
  production: 'dqsegqxnnhowqjxifhej',
};

try {
  const distPath = join(__dirname, '..', 'dist');
  
  console.log(`\n🔍 Verifying build for environment: ${mode}`);
  console.log(`📁 Checking: ${distPath}`);
  
  // Check if dist folder exists
  const distFiles = readdirSync(distPath);
  console.log(`📦 Found ${distFiles.length} files/folders in dist/`);

  // Read all JS files from dist/assets
  const assetsPath = join(distPath, 'assets');
  let allBundleContent = '';

  try {
    const assetFiles = readdirSync(assetsPath);
    const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
    
    console.log(`📜 Checking ${jsFiles.length} JavaScript bundles...`);
    
    jsFiles.forEach(file => {
      const filePath = join(assetsPath, file);
      const content = readFileSync(filePath, 'utf-8');
      allBundleContent += content;
    });
  } catch (err) {
    console.error(`❌ Error reading bundle files: ${err.message}`);
    process.exit(1);
  }

  const expectedProjectId = expectedEnvs[mode];

  if (!expectedProjectId) {
    console.error(`❌ Unknown environment: ${mode}`);
    console.error(`Valid environments: ${Object.keys(expectedEnvs).join(', ')}`);
    process.exit(1);
  }

  // Check for the expected project ID in all bundles
  if (!allBundleContent.includes(expectedProjectId)) {
    console.error(`\n❌ Build verification failed!`);
    console.error(`Expected ${mode} to use project: ${expectedProjectId}`);
    
    // Check which project IDs are actually in the build
    Object.entries(expectedEnvs).forEach(([env, projectId]) => {
      if (allBundleContent.includes(projectId)) {
        console.error(`⚠️  Found ${env} project ID instead: ${projectId}`);
      }
    });
    
    console.error(`\n💡 Troubleshooting steps:`);
    console.error(`   1. Verify .env is not committed: git ls-files .env`);
    console.error(`   2. Clear build cache: rm -rf dist node_modules/.vite`);
    console.error(`   3. Check .env.${mode} file has correct values`);
    console.error(`   4. Rebuild: npm run build:${mode === 'production' ? 'prod' : mode}`);
    
    process.exit(1);
  }

  console.log(`✅ Build verification passed for ${mode}`);
  console.log(`✅ Using correct Supabase project: ${expectedProjectId}\n`);
} catch (error) {
  console.error(`\n❌ Build verification error: ${error.message}`);
  console.error(`Stack trace:`, error.stack);
  process.exit(1);
}
