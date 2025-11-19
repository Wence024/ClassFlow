/**
 * Build verification script to ensure correct Supabase environment is embedded.
 * Run after build to validate the built files contain the expected project ID.
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
  // Read built index.html to check which Supabase URL is embedded
  const indexPath = join(__dirname, '..', 'dist', 'index.html');
  const indexContent = readFileSync(indexPath, 'utf-8');

  const expectedProjectId = expectedEnvs[mode];

  if (!expectedProjectId) {
    console.error(`❌ Unknown environment: ${mode}`);
    console.error(`Valid environments: ${Object.keys(expectedEnvs).join(', ')}`);
    process.exit(1);
  }

  if (!indexContent.includes(expectedProjectId)) {
    console.error(`❌ Build verification failed!`);
    console.error(`Expected ${mode} to use project: ${expectedProjectId}`);
    console.error(`Check your .env.${mode} file and vite.config.ts`);
    process.exit(1);
  }

  console.log(`✅ Build verification passed for ${mode}`);
  console.log(`Using correct Supabase project: ${expectedProjectId}`);
} catch (error) {
  console.error('❌ Build verification error:', error.message);
  process.exit(1);
}
