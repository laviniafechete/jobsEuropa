# 🚀 DigitalOcean Deployment Guide

## ✅ Fixed Issues

1. ✅ Added specific Node.js version (18.20.4) to both package.json files
2. ✅ Modified backend to serve frontend static files in production
3. ✅ Added deployment scripts and Procfile
4. ✅ Fixed rollup module dependency issue for both macOS and Linux
5. ✅ Updated build scripts for better dependency management
6. ✅ Addressed dependency vulnerabilities
7. ✅ Added rollup Linux x64 module for DigitalOcean deployment

## 🌐 Environment Variables Required

Set these environment variables in your DigitalOcean App Platform:

### Required Variables
```
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/jobs-europa
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
CORS_ORIGIN=https://your-domain.com
FRONTEND_URL=https://your-domain.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Optional Variables (for additional features)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_CALLBACK_URL=https://your-domain.com/api/auth/facebook/callback
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
WEB2SMS_USERNAME=your-web2sms-username
WEB2SMS_AUTH_KEY=your-web2sms-auth-key
```

## 🔧 Deployment Steps

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix rollup Linux dependency and Node.js version for DigitalOcean"
   git push origin main
   ```

2. **In DigitalOcean App Platform:**
   - Create new app from GitHub repository
   - Select your repository and branch
   - Choose "Web Service" as component type
   - Set build command: `npm run heroku-postbuild`
   - Set run command: `npm start`
   - Set Node.js version: 18.20.4 in runtime environment
   - Add all environment variables from above

3. **Configure Domain:**
   - Add your custom domain in DigitalOcean
   - Update CORS_ORIGIN and FRONTEND_URL to match your domain

## 🎯 How It Works

- **Build Process:** Frontend builds to `/dist`, backend serves it in production
- **Single Deployment:** One app serves both frontend and backend
- **Environment Detection:** Automatically serves static files only in production
- **Client-side Routing:** Backend handles React Router routes properly
- **Dependency Management:** Uses npm ci for faster, reliable builds
- **Cross-platform Support:** Includes rollup modules for both development (macOS) and deployment (Linux)

## 🐛 Recent Fixes

- **Node.js Version:** Fixed to 18.20.4 (stable LTS version)
- **Rollup Issue:** Added both @rollup/rollup-darwin-arm64 and @rollup/rollup-linux-x64-gnu
- **Build Scripts:** Updated to use npm ci for better performance
- **Dependencies:** Fixed vulnerabilities with npm audit
- **Linux Compatibility:** Added Linux x64 rollup module for DigitalOcean

## 🐛 Troubleshooting

- **Build fails:** Check all environment variables are set
- **API not working:** Verify CORS_ORIGIN matches your domain exactly
- **OAuth issues:** Update callback URLs to match your domain
- **Database issues:** Check MONGO_URI connection string
- **Rollup errors:** Both Linux and macOS rollup modules are now included
- **Node version issues:** Using specific version 18.20.4 instead of ranges

## 📞 Next Steps

1. Set up MongoDB Atlas database
2. Configure environment variables in DigitalOcean
3. Deploy and test the application
4. Configure custom domain if needed

## 🚀 Ready to Deploy!

Build tested successfully locally ✅
All rollup dependencies included ✅
Node.js version fixed ✅ 