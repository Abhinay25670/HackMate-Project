# Hackathon Partner Finder

A modern web application that helps developers find teammates for hackathons. Built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Authentication**: Secure login/signup via email, Google, and GitHub OAuth
- **Team Creation**: Create teams with details about hackathons, tech stack, and team requirements
- **Team Discovery**: Browse and filter teams by tech stack, location, and date
- **Application System**: Apply to join teams with a personalized message and portfolio links
- **Team Management**: Manage your teams, review applications, and accept/reject members
- **Bookmarking**: Save interesting teams for later reference
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication & Firestore)
- **Hosting**: Vercel
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Validation**: React Hook Form

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Vercel account (for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hackathon-partner-finder.git
cd hackathon-partner-finder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Enable Authentication and add the following sign-in methods:
   - Email/Password
   - Google
   - GitHub

4. Create a Firestore Database in production mode

5. Set up Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read teams, authenticated users can create
    match /teams/{teamId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.creatorId;
    }
    
    // Applications are readable by team creator and applicant
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.applicantId || 
         request.auth.uid == get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.creatorId);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid == get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.creatorId;
    }
    
    // Bookmarks are private to each user
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

6. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click "Add app"
   - Choose Web platform (</>)
   - Register the app and copy the configuration

### 4. Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration values in `.env`:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 5. Run the Development Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

Follow the prompts:
- Link to your Vercel account
- Set up the project
- Configure environment variables in Vercel dashboard

### 3. Add Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add all the Firebase environment variables from your `.env` file

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   └── teams/          # Team management components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@hackathonpartnerfinder.com or open an issue in the GitHub repository.
