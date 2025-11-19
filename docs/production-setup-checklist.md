# Production Setup Checklist (Hostinger)

## Initial Deployment

- [ ] Code pushed to `master` branch
- [ ] GitHub Actions build successful
- [ ] Hostinger pulled from `build` branch
- [ ] Files deployed to `public_html/`
- [ ] `config.js` exists in `public_html/`

## Verify config.js

SSH to Hostinger and check:
```bash
cat public_html/config.js
```

Should contain:
```javascript
window.APP_CONFIG = {
  SUPABASE_URL: 'https://dqsegqxnnhowqjxifhej.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGc...',
  SUPABASE_PROJECT_ID: 'dqsegqxnnhowqjxifhej',
  APP_ENV: 'production',
};
```

## Test Production

1. Open your production domain
2. Open browser console (F12)
3. Look for: `[Config] Using runtime config (production)`
4. Verify no errors
5. Test login and basic functionality

## Troubleshooting

**Issue: "Missing configuration values"**
- Check `public_html/config.js` exists
- Verify all fields are populated
- Check for JavaScript syntax errors

**Issue: Still showing dev/staging data**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for config source
- Verify `APP_ENV: 'production'` in config.js

**Issue: 404 on config.js**
- Verify file exists in `public_html/` (not subdirectory)
- Check file permissions (644 or 755)
- Verify GitHub Actions copied the file

## Switching Production Database

To point production to a different Supabase instance:

1. SSH to Hostinger
2. Edit `public_html/config.js`:
   ```bash
   nano public_html/config.js
   ```
3. Update these values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_PROJECT_ID`
4. Save and exit (Ctrl+X, Y, Enter)
5. Clear browser cache and refresh
6. Done! No rebuild required.
