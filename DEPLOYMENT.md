# Deployment Guide

This document provides step-by-step instructions for deploying the Birthday Management System frontend.

## Prerequisites

- Node.js 18+ installed locally
- A compatible external API backend (see API_SPEC.md)
- Git repository for your code
- Hosting platform account (Vercel, Netlify, etc.)

## Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd birthday-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_API_KEY=your-development-api-key
   VITE_API_TIMEOUT=30000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "New Project"
   - Import your repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   In Vercel dashboard, go to Project Settings → Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com
   VITE_API_KEY=your-production-api-key
   VITE_API_TIMEOUT=30000
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be available at `https://your-project.vercel.app`

### Option 2: Netlify

1. **Connect Repository to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "New site from Git"
   - Choose your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Set Environment Variables**
   In Netlify dashboard, go to Site Settings → Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com
   VITE_API_KEY=your-production-api-key
   VITE_API_TIMEOUT=30000
   ```

4. **Deploy**
   - Click "Deploy site"
   - Your app will be available at `https://your-site.netlify.app`

### Option 3: GitHub Pages

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Install gh-pages package
   npm install --save-dev gh-pages
   
   # Add to package.json scripts
   "deploy": "gh-pages -d dist"
   
   # Deploy
   npm run deploy
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Your app will be available at `https://yourusername.github.io/repository-name`

### Option 4: AWS S3 + CloudFront

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Configure S3 for Static Website Hosting**
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

4. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

5. **Set Up CloudFront (Optional)**
   - Create CloudFront distribution
   - Point origin to S3 bucket
   - Configure custom error pages for SPA routing

### Option 5: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   events {
     worker_connections 1024;
   }
   
   http {
     server {
       listen 80;
       location / {
         root /usr/share/nginx/html;
         index index.html index.htm;
         try_files $uri $uri/ /index.html;
       }
     }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t birthday-management-frontend .
   docker run -p 80:80 birthday-management-frontend
   ```

## Environment Variables Configuration

### Required Variables

- `VITE_API_BASE_URL`: Your API server URL (required)
- `VITE_API_KEY`: API authentication key (optional)
- `VITE_API_TIMEOUT`: Request timeout in milliseconds (optional, default: 30000)

### Development vs Production

**Development (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_KEY=dev-api-key
VITE_API_TIMEOUT=30000
```

**Production**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_KEY=prod-api-key
VITE_API_TIMEOUT=30000
```

## Custom Domain Setup

### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned

### Netlify Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records
4. SSL certificate will be automatically provisioned

## SSL/HTTPS Configuration

All major hosting platforms (Vercel, Netlify, GitHub Pages) provide automatic SSL certificates. For custom deployments:

1. **Let's Encrypt with Certbot**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

2. **CloudFlare SSL**
   - Add your domain to CloudFlare
   - Enable SSL/TLS encryption
   - Configure DNS records

## Performance Optimization

### Build Optimization

1. **Enable Build Optimizations**
   ```javascript
   // vite.config.ts
   export default defineConfig({
     build: {
       minify: 'terser',
       sourcemap: false,
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
           }
         }
       }
     }
   });
   ```

2. **Enable Compression**
   ```javascript
   // vite.config.ts
   import { defineConfig } from 'vite';
   import { compression } from 'vite-plugin-compression';
   
   export default defineConfig({
     plugins: [
       compression({ algorithm: 'gzip' }),
       compression({ algorithm: 'brotliCompress', ext: '.br' })
     ]
   });
   ```

### CDN Configuration

1. **CloudFront Settings**
   - Enable Gzip compression
   - Set cache behaviors for static assets
   - Configure custom error pages

2. **CloudFlare Settings**
   - Enable Auto Minify for JS/CSS/HTML
   - Enable Brotli compression
   - Configure page rules for caching

## Monitoring and Analytics

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

2. **Configuration**
   ```javascript
   // main.tsx
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: import.meta.env.MODE,
   });
   ```

### Analytics

1. **Google Analytics**
   ```bash
   npm install gtag
   ```

2. **Plausible Analytics**
   ```html
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```

## Backup and Recovery

### Database Backup (API Side)

Ensure your API backend has proper backup procedures for:
- Birthday records
- User settings
- Configuration data

### Source Code Backup

1. **Git Repository**
   - Use GitHub/GitLab/Bitbucket
   - Regular commits and pushes
   - Multiple contributors with access

2. **Automated Backups**
   - Repository mirroring
   - Automated exports
   - Version tagging for releases

## Security Considerations

### HTTPS Only

Ensure all production deployments use HTTPS:
```javascript
// Check for HTTPS in production
if (import.meta.env.PROD && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### API Security

1. **API Key Management**
   - Use environment variables
   - Rotate keys regularly
   - Implement API rate limiting

2. **CORS Configuration**
   - Restrict origins in production
   - Use specific domains, not wildcards
   - Implement proper preflight handling

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://your-api-domain.com;
">
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify environment variables are set
   - Clear cache and reinstall dependencies

2. **API Connection Issues**
   - Verify CORS settings
   - Check API endpoint URLs
   - Validate API key permissions

3. **Routing Issues**
   - Configure server for SPA routing
   - Check base URL configuration
   - Verify history API support

### Debugging Tools

1. **Browser Developer Tools**
   - Network tab for API calls
   - Console for JavaScript errors
   - Application tab for storage

2. **Build Analysis**
   ```bash
   npm run build -- --analyze
   ```

3. **Lighthouse Audit**
   - Performance optimization
   - SEO improvements
   - Accessibility checks

## Support and Maintenance

### Regular Updates

1. **Dependency Updates**
   ```bash
   npm audit
   npm update
   ```

2. **Security Updates**
   ```bash
   npm audit fix
   ```

3. **Performance Monitoring**
   - Regular Lighthouse audits
   - User feedback collection
   - Performance metrics tracking

### Rollback Procedures

1. **Vercel Rollback**
   - Use Vercel dashboard
   - Select previous deployment
   - Instant rollback

2. **Git-based Rollback**
   ```bash
   git revert HEAD
   git push origin main
   ```

For additional support, refer to the documentation in `README.md` and `API_SPEC.md`.