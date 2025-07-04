# 🔑 Get Firebase Web App Configuration

You have the **service account keys**, but for the React frontend, you need the **Web App Configuration**. Here's how to get it:

## 🚨 Important Security Note

**Never use service account keys in frontend code!** Service account keys are for backend/admin use only. Frontend apps use Web App configuration which is safe to expose.

## 📋 Step-by-Step Guide

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/hackmate-855bf/settings/general

### 2. Find Your Web App
- Scroll down to "Your apps" section
- Look for a web app (</> icon)
- If no web app exists, click "Add app" → Web

### 3. Get the Configuration
Click on your web app, then you'll see config like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // Copy this
  authDomain: "hackmate-855bf.firebaseapp.com",
  projectId: "hackmate-855bf", // Already set
  storageBucket: "hackmate-855bf.appspot.com", // Already set
  messagingSenderId: "123456789", // Copy this
  appId: "1:123456789:web:abcdef..." // Copy this
};
```

### 4. Update Your .env File
Replace the placeholder values in `.env`:
```bash
REACT_APP_FIREBASE_API_KEY=AIzaSy... # Your actual API key
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789 # Your sender ID
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef... # Your app ID
```

## 🔧 Enable Firebase Services

### Authentication
1. Go to Authentication → Get Started
2. Sign-in method → Enable:
   - Email/Password
   - Google (optional)
   - GitHub (optional)

### Firestore Database
1. Go to Firestore Database → Create database
2. Choose "Start in production mode"
3. Select a location (us-central1 recommended)

### Security Rules
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

## 🚀 Deploy After Configuration

Once you've updated `.env` with the correct values:

```bash
# Test locally first
npm start

# Deploy to Vercel
./deploy-demo.sh
```

## 🎯 What You Need vs What You Have

| What You Have | What You Need | Status |
|---------------|---------------|---------|
| Service Account Keys | ❌ Not for frontend | 
| project_id | ✅ Already set | 
| Web API Key | ❓ Get from console |
| Sender ID | ❓ Get from console |
| App ID | ❓ Get from console |

## 🔍 Quick Check

Your `.env` should look like this when complete:
```bash
REACT_APP_FIREBASE_PROJECT_ID=hackmate-855bf ✅
REACT_APP_FIREBASE_AUTH_DOMAIN=hackmate-855bf.firebaseapp.com ✅
REACT_APP_FIREBASE_STORAGE_BUCKET=hackmate-855bf.appspot.com ✅
REACT_APP_FIREBASE_API_KEY=AIzaSy... ❓ Need from console
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123... ❓ Need from console
REACT_APP_FIREBASE_APP_ID=1:123... ❓ Need from console
```

---

**Next Step**: Visit the Firebase console link above and get your Web App configuration! 🔥