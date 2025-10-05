# Deployment Guide

## GitHub Pages Deployment

### Setting Up Environment Variables

GitHub Pages serves static files only, so environment variables must be embedded at **build time**.

#### Step 1: Add Secrets to GitHub Repository

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret (e.g., `VITE_MAPBOX_TOKEN`)

#### Step 2: Configure GitHub Actions

The workflow file `.github/workflows/deploy.yml` is already configured to:
- Trigger on push to `main` branch
- Install dependencies
- Build with environment variables from GitHub Secrets
- Deploy to `gh-pages` branch automatically

#### Step 3: Push to Main Branch

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Actions will automatically build and deploy your site.

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
npm run deploy
```

**Note:** Manual deployment will use your local `.env` file, which may expose secrets in the git history. Use GitHub Actions for production deployments.

### Environment Variables Required

- `VITE_MAPBOX_TOKEN` - Your Mapbox access token

Add these to:
- **Local development:** `.env` file (not committed)
- **GitHub Pages:** GitHub repository secrets

### Important Security Notes

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use GitHub Secrets** for production deployment
3. **Rotate tokens** if accidentally exposed
4. **Use restricted tokens** with minimal permissions (read-only for Mapbox)

### Verifying Deployment

After deployment, your site will be available at:
```
https://<username>.github.io/geolab/
```

Check the Actions tab on GitHub to monitor deployment status.

### Troubleshooting

**404 errors on assets:**
- Ensure `vite.config.ts` has `base: '/geolab/'` set correctly

**Environment variables not working:**
- Verify secrets are added to GitHub repository settings
- Check GitHub Actions logs for build errors
- Ensure variable names start with `VITE_` prefix

**Build fails:**
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility in workflow file
