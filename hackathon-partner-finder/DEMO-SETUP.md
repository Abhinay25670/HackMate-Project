# 🚀 Live Demo Setup Guide

This guide will help you deploy a live demo of the Hackathon Partner Finder to Vercel in under 10 minutes.

## 📋 Prerequisites

- [Firebase Account](https://firebase.google.com) (free)
- [Vercel Account](https://vercel.com) (free)
- [GitHub Account](https://github.com) (for GitHub OAuth)
- [Google Cloud Console](https://console.cloud.google.com) (for Google OAuth)

## 🎯 Quick Deployment (One-Click Method)

### Step 1: Fork & Deploy
1. Fork this repository to your GitHub account
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Select your forked repository
5. Click "Deploy" (will fail initially - that's expected!)

### Step 2: Firebase Setup (5 minutes)

1. **Create Firebase Project**
   ```
   https://console.firebase.google.com
   → Create Project → "hackathon-demo" → Continue
   ```

2. **Enable Authentication**
   ```
   Authentication → Get Started → Sign-in method
   → Enable: Email/Password, Google, GitHub
   ```

3. **Create Firestore Database**
   ```
   Firestore Database → Create database → Production mode
   → Choose location → Done
   ```

4. **Get Configuration**
   ```
   Project Settings → General → Your apps
   → Add app → Web (</>) → Register app
   → Copy the config object
   ```

### Step 3: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:

```
REACT_APP_FIREBASE_API_KEY = your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = your-sender-id
REACT_APP_FIREBASE_APP_ID = your-app-id
```

4. Click "Redeploy" in Vercel

## 🔧 Local Deployment Method

### Option A: Using the Deployment Script

```bash
# Clone the repository
git clone <your-repo-url>
cd hackathon-partner-finder

# Run the deployment script
./deploy-demo.sh
```

### Option B: Manual Deployment

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.demo .env
# Edit .env with your Firebase config

# 3. Build the project
npm run build

# 4. Deploy to Vercel
vercel --prod
```

## 🔥 Firebase Security Rules Setup

Copy these rules to Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /teams/{teamId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.creatorId;
    }
    
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.applicantId || 
         request.auth.uid == get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.creatorId);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid == get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.creatorId;
    }
    
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎮 Demo Data (Optional)

### Create Sample Teams
1. Sign up for an account in your deployed app
2. Create a few sample teams with different:
   - Tech stacks (React, Node.js, Python, etc.)
   - Locations (Online, San Francisco, New York)
   - Future dates

### Test All Features
- ✅ User registration/login
- ✅ Create teams
- ✅ Browse and filter teams
- ✅ Apply to join teams
- ✅ Bookmark teams
- ✅ Manage applications
- ✅ Dark/light mode toggle

## 🌐 Demo URLs

After deployment, you'll get URLs like:
- **Production**: `https://your-app-name.vercel.app`
- **Preview**: `https://your-app-name-git-main.vercel.app`

## 🔧 OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add your Vercel domain to authorized origins
5. Copy Client ID to Firebase Authentication

### GitHub OAuth
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create New OAuth App
3. Set Authorization callback URL: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copy Client ID/Secret to Firebase Authentication

## 🎯 What You'll Get

A fully functional live demo with:
- **Landing page** with modern design
- **Authentication** system
- **Team creation** and management
- **Team discovery** with filters
- **Application system**
- **Bookmarking** functionality
- **Responsive design** for mobile/desktop
- **Dark/light mode** toggle

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase Connection Issues
- Check environment variables in Vercel
- Ensure Firebase project is active
- Verify Firestore security rules

### OAuth Issues
- Check authorized domains in Firebase/Google/GitHub
- Ensure callback URLs are correct

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure Firebase services are enabled
4. Test with a fresh incognito/private window

## 🎉 Success!

Your live demo should now be available at your Vercel URL. Share it with others to showcase the Hackathon Partner Finder application!