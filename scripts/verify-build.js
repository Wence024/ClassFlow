/**
 * Build verification script using build-info.json metadata file.
 * Verifies that the correct Supabase environment was used during build.
 * 
 * Usage: node scripts/verify-build.js [environment]
 * Example: node scripts/verify-build.js production
 */
import { readFileSync } from 'fs';
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
  const buildInfoPath = join(distPath, 'build-info.json');
  
  console.log(`\n🔍 Verifying build for environment: ${mode}`);
  console.log(`📁 Checking: ${buildInfoPath}`);
  
  // Read build-info.json
  let buildInfo;
  try {
    const buildInfoContent = readFileSync(buildInfoPath, 'utf-8');
    buildInfo = JSON.parse(buildInfoContent);
  } catch (err) {
    console.error(`❌ Error reading build-info.json: ${err.message}`);
    console.error(`\n💡 Troubleshooting steps:`);
    console.error(`   1. Ensure build completed successfully`);
    console.error(`   2. Check that vite.config.ts has buildInfoPlugin enabled`);
    console.error(`   3. Rebuild: npm run build:${mode === 'production' ? 'prod' : mode}`);
    process.exit(1);
  }

  console.log(`📦 Build Info:`);
  console.log(`   Environment: ${buildInfo.env}`);
  console.log(`   Project ID: ${buildInfo.supabaseProjectId}`);
  console.log(`   Build Time: ${buildInfo.buildTime}`);

  const expectedProjectId = expectedEnvs[mode];

  if (!expectedProjectId) {
    console.error(`\n❌ Unknown environment: ${mode}`);
    console.error(`Valid environments: ${Object.keys(expectedEnvs).join(', ')}`);
    process.exit(1);
  }

  // Verify the project ID matches
  if (buildInfo.supabaseProjectId !== expectedProjectId) {
    console.error(`\n❌ Build verification failed!`);
    console.error(`Expected ${mode} to use project: ${expectedProjectId}`);
    console.error(`Actually using project: ${buildInfo.supabaseProjectId}`);
    
    // Check which environment this project ID belongs to
    Object.entries(expectedEnvs).forEach(([env, projectId]) => {
      if (buildInfo.supabaseProjectId === projectId) {
        console.error(`⚠️  Build used ${env} environment instead of ${mode}`);
      }
    });
    
    console.error(`\n💡 Troubleshooting steps:`);
    console.error(`   1. Verify .env is not committed: git ls-files .env`);
    console.error(`   2. Clear build cache: rm -rf dist node_modules/.vite`);
    console.error(`   3. Check .env.${mode} file has correct values`);
    console.error(`   4. Rebuild: npm run build:${mode === 'production' ? 'prod' : mode}`);
    
    process.exit(1);
  }

  // Verify environment name matches
  if (buildInfo.env !== mode) {
    console.warn(`⚠️  Warning: VITE_APP_ENV is "${buildInfo.env}" but expected "${mode}"`);
  }

  console.log(`\n✅ Build verification passed!`);
  console.log(`✅ Environment: ${mode}`);
  console.log(`✅ Project ID: ${expectedProjectId}\n`);
} catch (error) {
  console.error(`\n❌ Build verification error: ${error.message}`);
  console.error(`Stack trace:`, error.stack);
  process.exit(1);
}
