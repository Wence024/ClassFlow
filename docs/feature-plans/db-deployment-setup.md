# Multi-Environment Database Deployment Setup

## Overview

This document outlines the multi-environment deployment strategy for ClassFlow. The system uses **runtime configuration** for production deployments, allowing database switching without rebuilding the application.

**Key Features**:
- **Production (Hostinger)**: Runtime config via `public/config.js` - edit directly on server, no rebuild needed
- **Staging (Vercel)**: Build-time environment variables set in Vercel dashboard
- **Development (Local)**: Hardcoded credentials in `src/lib/runtimeConfig.ts`

## Environment Architecture

### Three Supabase Projects

1. **Development (Lovable Preview / Local)**
   - **Purpose**: Active development and testing
   - **Project URL**: `https://wkfgcroybuuefaulqsru.supabase.co`
   - **Project ID**: `wkfgcroybuuefaulqsru`
   - **Config Source**: Hardcoded in `src/lib/runtimeConfig.ts`
   - **Usage**: Default for `npm run dev`

2. **Staging (Vercel Deployment)**
   - **Purpose**: Pre-production testing and validation
   - **Project URL**: `https://pnmzjmcfeekculqyirpr.supabase.co`
   - **Project ID**: `pnmzjmcfeekculqyirpr`
   - **Config Source**: Vercel Environment Variables (set in dashboard)
   - **Usage**: Vercel staging deployment for QA

3. **Production (Hostinger via Git)**
   - **Purpose**: Live production environment
   - **Project URL**: `https://dqsegqxnnhowqjxifhej.supabase.co`
   - **Project ID**: `dqsegqxnnhowqjxifhej`
   - **Config Source**: Runtime config (`public/config.js` on server)
   - **Usage**: Hostinger production - **can switch databases without rebuild**

## Security Model

### What's Safe to Commit

✅ **Committed to Git** (Public-Safe):

- Supabase Project URLs
- Supabase Anon/Public Keys  
- Supabase Project IDs
- Runtime config templates (`public/config.production.template.js`)

**Rationale**: These credentials are designed to be public-facing. Security is enforced through:

- Row Level Security (RLS) policies on database tables
- Supabase Auth for user authentication
- API rate limiting

### What Must Stay Secret

❌ **NEVER Commit**:

- Service Role Keys (bypass RLS)
- Database passwords
- Private API keys
- Active runtime config (`public/config.js` - gitignored)

## File Structure

```txt
project-root/
├── public/
│   ├── config.js                          # Active runtime config (gitignored)
│   └── config.production.template.js      # Template for Hostinger (committed)
├── src/
│   └── lib/
│       ├── runtimeConfig.ts               # Config loader with fallbacks
│       └── supabase.ts                    # Supabase client
├── .env.example                           # Vercel env vars documentation
└── .gitignore                             # Excludes public/config.js
```

## Configuration System

### Runtime Config Hierarchy

The application uses a three-tier configuration fallback system:

1. **Runtime Config** (Production only)
   - Source: `window.APP_CONFIG` from `public/config.js`
   - Loaded via `<script>` tag in `index.html`
   - Can be edited on server without rebuilding app

2. **Build-time Environment Variables** (Staging only)
   - Source: `import.meta.env.VITE_*` from Vercel environment variables
   - Set in Vercel Project Settings → Environment Variables
   - Compiled into the build at deploy time

3. **Hardcoded Defaults** (Development)
   - Source: `DEV_CONFIG` constant in `src/lib/runtimeConfig.ts`
   - No setup needed for local development
   - Always uses development Supabase project

### Supabase Client

**Primary Client**: `src/lib/supabase.ts`

- Imports `getConfig()` from `src/lib/runtimeConfig.ts`
- Automatically selects correct Supabase project based on environment
- Used throughout the entire codebase
- Exports `config` object for environment detection

**Example Usage**:
```typescript
import { supabase, config } from '@/lib/supabase';

// Check environment
if (config.APP_ENV === 'production') {
  // Production-specific logic
}

// Use Supabase client
const { data } = await supabase.from('table').select();
```

## Development Workflow

### Local Development

1. **Environment**: Development Supabase (hardcoded)
2. **Command**: `npm run dev`
3. **Preview**: Lovable's live preview or `http://localhost:8080`
4. **No Setup**: Configuration is hardcoded in `src/lib/runtimeConfig.ts`

**Migration Testing**:

```bash
# Develop and test locally
npm run dev

# Verify in browser
# Commit changes
git add .
git commit -m "feat: add new feature"
```

### Staging Deployment (Vercel)

**Setup** (One-time):

1. Go to Vercel Project Settings → Environment Variables
2. Add these variables:
   ```
   VITE_APP_ENV=staging
   VITE_SUPABASE_URL=https://pnmzjmcfeekculqyirpr.supabase.co
   VITE_SUPABASE_ANON_KEY=<staging_anon_key>
   VITE_SUPABASE_PROJECT_ID=pnmzjmcfeekculqyirpr
   ```

**Deployment**:

1. Push to `staging` branch or trigger manual deploy in Vercel
2. Vercel builds with environment variables
3. Test at Vercel staging URL
4. Verify database connections and functionality

### Production Deployment (Hostinger)

**Automatic Deployment** (via GitHub Actions):

1. Push to `master` branch
2. GitHub Actions:
   - Runs `npm run build`
   - Copies `public/config.production.template.js` → `dist/config.js`
   - Pushes `dist/` to `build` branch
3. Hostinger pulls from `build` branch to `public_html/`

**Verify Deployment**:

```bash
# SSH to Hostinger
ssh user@your-server.com

# Check config exists
cat public_html/config.js

# Should show:
# window.APP_CONFIG = {
#   SUPABASE_URL: 'https://dqsegqxnnhowqjxifhej.supabase.co',
#   ...
# }
```

**Switch Production Database** (No Rebuild Needed!):

```bash
# SSH to Hostinger
ssh user@your-server.com

# Edit runtime config
nano public_html/config.js

# Update these values:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_PROJECT_ID

# Save and exit (Ctrl+X, Y, Enter)

# Clear browser cache and refresh - Done!
```

- QA testing with production-like environment
- Migration validation before production
- Stakeholder demos

**Vercel Project Setup**:

- **Project Name**: `classflow-staging`
- **Framework**: Vite
- **Build Command**: `npm run build:staging`
- **Output Directory**: `dist`
- **Environment Variables**: Automatically read from `.env.staging` (committed)

### Production Deployment (Hostinger)

1. **Environment**: Production Supabase
2. **Trigger**: Push to `master` branch
3. **Build Command**: `npm run build:prod` (Hostinger auto-build)
4. **Domain**: Production domain (e.g., `classflowapp.com`)

**Hostinger Git Integration**:

- Monitors `master` branch
- Auto-builds on push
- Reads `.env.production` from repository

## Migration Testing Strategy

### Step-by-Step Workflow

```txt
┌─────────────────────────────────────────────────────────────┐
│ 1. DEVELOPMENT (Lovable + Dev Supabase)                     │
│    - Write migration SQL                                    │
│    - Test in Lovable preview                                │
│    - Verify RLS policies                                    │
│    - Commit migration file                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. STAGING (Vercel + Staging Supabase)                      │
│    - Push to 'staging' branch                               │
│    - Vercel auto-deploys                                    │
│    - Run QA tests                                           │
│    - Validate with realistic data                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. PRODUCTION (Hostinger + Production Supabase)             │
│    - Merge 'staging' → 'master                              │
│    - Hostinger auto-deploys                                 │
│    - Monitor production metrics                             │
└─────────────────────────────────────────────────────────────┘
```

### Migration Execution

**Option A: Automatic (Recommended)**

- Supabase CLI detects new migration files in `supabase/migrations/`
- Auto-applies to connected project on next deployment
- **Staging**: Applied when Vercel builds
- **Production**: Applied when Hostinger builds

**Option B: Manual (Explicit Control)**

```bash
# Apply to Staging
npx supabase db push --db-url "postgresql://postgres.pnmzjmcfeekculqyirpr:[password]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Apply to Production (after staging validation)
npx supabase db push --db-url "postgresql://postgres.wkfgcroybuuefaulqsru:[password]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

## NPM Scripts

### Simplified Build Commands

With the runtime config system, we only need one build command:

```bash
# Development (local)
npm run dev

# Build (works for all environments)
npm run build

# Preview built application locally
npm run preview
```

**No more environment-specific builds** - the same build works for staging and production!

### How It Works

**Development**: Uses hardcoded config from `src/lib/runtimeConfig.ts`
**Staging**: Vercel injects `VITE_*` env vars during build via `vite.config.ts` define block
**Production**: Runtime config from `public/config.js` loaded at app startup

## Configuration Reference

### Development Config (Hardcoded)

**Location**: `src/lib/runtimeConfig.ts`

```typescript
const DEV_CONFIG: AppConfig = {
  SUPABASE_URL: 'https://wkfgcroybuuefaulqsru.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGc...',
  SUPABASE_PROJECT_ID: 'wkfgcroybuuefaulqsru',
  APP_ENV: 'development',
};
```

**No setup needed** - just run `npm run dev`

### Staging Config (Vercel Environment Variables)

**Setup in Vercel Dashboard** → Project Settings → Environment Variables:

```
VITE_APP_ENV=staging
VITE_SUPABASE_URL=https://pnmzjmcfeekculqyirpr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubXpqbWNmZWVrY3VscXlpcnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzQxNDQsImV4cCI6MjA3OTAxMDE0NH0.QTyH2jCzAt-wxqiNKG6xcwILo_zZUrnJknfjcsp28oo
VITE_SUPABASE_PROJECT_ID=pnmzjmcfeekculqyirpr
```

### Production Config (Runtime on Server)

**Location**: `public_html/config.js` on Hostinger server

```javascript
window.APP_CONFIG = {
  SUPABASE_URL: 'https://dqsegqxnnhowqjxifhej.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc2VncXhubmhvd3FqeGlmaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzc1MzIsImV4cCI6MjA3OTgxMzUzMn0.hJKw731wyZHI8Py4LU0AgT2JKI5shenczB83jo4paT0',
  SUPABASE_PROJECT_ID: 'dqsegqxnnhowqjxifhej',
  APP_ENV: 'production',
};
```

**Edit directly on server** - no rebuild needed!

## Vercel Deployment Setup

### One-Time Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your Git repository
3. Configure project:
   - **Project Name**: `classflow-staging`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables

Go to Project Settings → Environment Variables and add:

```
VITE_APP_ENV=staging
VITE_SUPABASE_URL=https://pnmzjmcfeekculqyirpr.supabase.co
VITE_SUPABASE_ANON_KEY=<your_staging_anon_key>
VITE_SUPABASE_PROJECT_ID=pnmzjmcfeekculqyirpr
```

### Deploy

Push to `staging` branch or trigger manual deploy - Vercel will build with environment variables.

## Hostinger Deployment (via GitHub Actions)

### How It Works

1. Push to `master` branch
2. GitHub Actions workflow (`.github/workflows/publish.yml`):
   - Runs `npm run build`
   - Copies `public/config.production.template.js` to `dist/config.js`
   - Pushes `dist/` to `build` branch
3. Hostinger pulls from `build` branch

### Hostinger Git Integration Setup

1. Log in to Hostinger hPanel
2. Navigate to Git section
3. Configure:
   - **Repository**: Your GitHub repo
   - **Branch**: `build`
   - **Deploy Path**: `/public_html`
   - **Auto-Deploy**: Enabled

### Verify Deployment

SSH to your server and check:

```bash
cat public_html/config.js
```

Should show:
```javascript
window.APP_CONFIG = {
  SUPABASE_URL: 'https://dqsegqxnnhowqjxifhej.supabase.co',
  // ...
}
```

```bash
# Hostinger auto-runs on push to main:
npm install
npm run build:prod  # Uses .env.production
# Copies dist/ to web root
```

## Rollback Strategy

### Emergency Rollback (Production)

**Option 1: Git Revert**

```bash
git revert <commit-hash>
git push origin main
# Hostinger auto-deploys reverted code
```

**Option 2: Database Rollback**

```bash
# Restore from backup
npm run backup:prod  # Should be run regularly
# Manually apply backup SQL if needed
```

**Option 3: Vercel Rollback (if using production mirror)**

- Go to Vercel Dashboard → Deployments
- Find last stable deployment
- Click "Promote to Production"

## Best Practices

### 1. Migration Development

- ✅ Always test migrations in Development first
- ✅ Write reversible migrations (`ALTER` with `DROP` fallback)
- ✅ Include RLS policies in migration files
- ✅ Test with realistic data volumes in Staging

### 2. Environment Isolation

- ✅ Never point Production code to Dev/Staging databases
- ✅ Keep separate test accounts per environment
- ✅ Use environment indicators in UI (see Implementation section)

### 3. Backup Strategy

- ✅ Run `npm run backup:prod` before major migrations
- ✅ Store backups in `supabase/migrations/data_backups/`
- ✅ Test restoration process periodically

### 4. Monitoring

- ✅ Check Supabase Dashboard after deployments
- ✅ Monitor Vercel build logs for errors
- ✅ Verify RLS policies are applied correctly

## Troubleshooting

### Issue: Wrong Supabase Project Connected

**Symptom**: Data from wrong environment appearing in UI

**Solution**:

```bash
# Check current environment
console.log('Environment:', import.meta.env.VITE_APP_ENV)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

# Verify .env file is correct
cat .env.development  # or .env.staging, .env.production
```

### Issue: Migration Not Applied

**Symptom**: New table/column not found

**Solution**:

```bash
# Manually apply migration
npx supabase db push --db-url "[connection-string]"

# Check migration history
npx supabase migration list
```

### Issue: Build Fails on Vercel/Hostinger

**Symptom**: "Module not found" or "Environment variable missing"

**Solution**:

1. Verify `.env.staging` or `.env.production` is committed
2. Check build command uses correct environment flag
3. Verify all dependencies are in `package.json` (not devDependencies)

## Environment Indicator (UI)

A small environment badge is displayed in development and staging builds:

**Location**: Bottom-right corner
**Appearance**:

- 🟢 **DEV** (green badge) in development
- 🟡 **STAGING** (yellow badge) in staging
- Hidden in production

**Implementation**: See `src/components/EnvironmentIndicator.tsx`

## Future Considerations

### Potential Enhancements

1. **CI/CD Pipeline**
   - GitHub Actions for automated testing
   - Automated migration validation
   - Slack notifications on deployment

2. **Database Seeding**
   - Seed scripts for Staging environment
   - Anonymized production data for testing

3. **Multiple Staging Environments**
   - Feature branches → temporary Vercel previews
   - Isolated Supabase projects for large features

4. **Monitoring & Observability**
   - Sentry for error tracking
   - Supabase Analytics for query performance
   - Uptime monitoring (UptimeRobot, Pingdom)

## Implementation Status

### ✅ Completed (2025-01-19)

1. **Environment Files Created**
   - `.env.development` - Development Supabase (wkfgcroybuuefaulqsru)
   - `.env.staging` - Staging Supabase (pnmzjmcfeekculqyirpr)
   - `.env.production` - Production Supabase (dqsegqxnnhowqjxifhej)
   - **Root `.env` file deleted** - Was causing conflicts with environment-specific files
   - Added `.env` and `.env.local` to `.gitignore`

2. **Primary Supabase Client (`src/lib/supabase.ts`)**
   - Environment-aware client that dynamically selects correct project
   - Reads from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Logs environment info in development/staging for debugging

3. **Deprecated Client Migration**
   - Marked `src/integrations/supabase/client.ts` as deprecated
   - Migrated all imports to use `@/lib/supabase`:
     - ✅ `src/features/reports/pages/InstructorReportsPage.tsx`
     - ✅ `src/features/reports/services/instructorReportService.ts`
     - ✅ `src/features/reports/services/loadCalculationService.ts`
     - ✅ All other files (45+ files)

4. **Environment Validation (`src/lib/validateEnv.ts`)**
   - Validates required environment variables at startup
   - Logs environment info in non-production builds
   - Throws clear errors if configuration is missing

5. **Vite Configuration Updates (`vite.config.ts`)**
   - Explicitly loads environment files based on mode using `loadEnv(mode, process.cwd(), 'VITE_')`
   - Added console.log debugging to track environment loading
   - Defines env variables for `import.meta.env` via `define` block
   - Ensures correct environment selection during build

6. **Build Verification (`scripts/verify-build.js`)**
   - Enhanced post-build script to verify correct Supabase project ID
   - Shows detailed debugging output when wrong environment is detected
   - Lists which project IDs are found in the build
   - Provides clear troubleshooting steps
   - Prevents accidental deployment of wrong environment

7. **GitHub Actions Workflow (`.github/workflows/publish.yml`)**
   - Updated to use `npm run build:prod`
   - Added step to explicitly remove root `.env` file before building
   - Added build verification step
   - Ensures production builds use correct database

8. **Documentation Corrections**
   - Fixed environment mapping comments in `src/lib/supabase.ts`
   - Documented root `.env` file removal (auto-generated by Lovable)
   - Added troubleshooting section for common issues

### ⚠️ Manual Steps Required

**Update `package.json` scripts** (file is read-only, needs manual edit):
```json
{
  "build:dev": "vite build --mode development && node scripts/verify-build.js development",
  "build:staging": "vite build --mode staging && node scripts/verify-build.js staging",
  "build:prod": "tsc -b && vite build --mode production && node scripts/verify-build.js production"
}
```

### 🔄 Deployment Workflow

**Local Development (Lovable)**
```bash
npm run dev  # Uses .env.development → wkfgcroybuuefaulqsru
```

**Staging Preview (Local)**
```bash
npm run build:staging
npm run preview:staging  # Uses .env.staging → pnmzjmcfeekculqyirpr
```

**Production Preview (Local)**
```bash
npm run build:prod
npm run preview:prod  # Uses .env.production → dqsegqxnnhowqjxifhej
```

**GitHub Actions → Hostinger**
```bash
# Push to master branch
git push origin master

# GitHub Actions automatically:
# 1. Runs npm install
# 2. Runs npm run build:prod (uses .env.production)
# 3. Verifies build contains dqsegqxnnhowqjxifhej
# 4. Deploys dist/ to Hostinger
```

## Troubleshooting

### Build Verification Fails with Wrong Project ID

**Symptoms:**
```
❌ Build verification failed!
Expected production to use project: dqsegqxnnhowqjxifhej
⚠️  Found development project ID instead: wkfgcroybuuefaulqsru
```

**Root Causes:**
1. Root `.env` file exists and overrides `.env.production`
2. Build cache contains old environment variables
3. Environment-specific file has incorrect values

**Solutions:**
1. Delete root `.env` file: `rm -f .env`
2. Clear build cache: `rm -rf dist node_modules/.vite`
3. Verify `.env.production` contains correct values
4. Rebuild: `npm run build:prod`

### Lovable Regenerates Root `.env` File

**Symptoms:**
Root `.env` file keeps appearing after deletion

**Solution:**
- The `.env` file is auto-generated by Lovable's integration
- It's already in `.gitignore` so it won't be committed
- GitHub Actions explicitly removes it before building
- For local builds, manually delete it before running `npm run build:prod`

### Timetable Loads Forever in Production Preview

**Symptoms:**
After running `npm run build:prod` and `npm run preview:prod`, the timetable never loads

**Root Causes:**
1. Build is connecting to wrong Supabase project
2. User session is stored in localStorage from previous environment

**Solutions:**
1. Verify build uses correct environment: `node scripts/verify-build.js production`
2. Clear browser localStorage/cookies and login again
3. Check browser console for Supabase connection errors
4. Verify `.env.production` has correct credentials

### Environment Variables Not Loading

**Symptoms:**
```
Missing required environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

**Root Causes:**
1. Environment-specific file doesn't exist
2. Variables not prefixed with `VITE_`
3. Build mode doesn't match environment file

**Solutions:**
1. Ensure `.env.production` exists with all required variables
2. Check all variables start with `VITE_` prefix
3. Run build with correct mode: `vite build --mode production`

## Conclusion

This multi-environment setup provides:

- ✅ Safe migration testing pipeline
- ✅ Isolated environments for each stage
- ✅ Simple, Git-based deployment workflow
- ✅ Production safety through Staging validation
- ✅ Build verification to prevent wrong environment deployments
- ✅ Environment validation at application startup
- ✅ Clear troubleshooting guidance for common issues

**Next Steps**:

1. ✅ Document plan (this file)
2. ✅ Create environment files
3. ✅ Update Supabase client
4. ✅ Migrate deprecated imports
5. ⏳ Manual update of `package.json` scripts (add verification to build commands)
6. ⏳ Set up Vercel project (optional for staging)
7. ⏳ Configure Hostinger Git integration
8. ⏳ Test full deployment pipeline end-to-end