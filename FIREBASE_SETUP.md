# Firebase Setup Guide for VicPol Paperwork

This guide will help you set up Firebase for cloud authentication and data sync.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "VicPol Paperwork")
4. Click "Continue"
5. Disable Google Analytics (optional)
6. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web** icon (`</>`)
2. Enter app nickname (e.g., "VicPol Web App")
3. Click "Register app"
4. Copy the `firebaseConfig` object that appears

## Step 3: Configure Your App

1. Open `src/firebase.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Build** â†’ **Authentication**
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Toggle **Enable** to ON
5. Click "Save"

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build** â†’ **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode**
4. Choose your Firestore location (closest to your users)
5. Click "Enable"

## Step 6: Configure Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Drafts collection - users can only read/write their own drafts
    match /drafts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Run the App

```bash
npm run dev
```

## Features Enabled

âœ… **Cloud Authentication** - Users can sign up and log in from any device
âœ… **Cross-Device Sync** - Drafts sync across all devices
âœ… **Secure Storage** - User data is protected by Firebase security rules
âœ… **Auto-Population** - Officer details auto-fill in reports
âœ… **Session Persistence** - Stay logged in across browser sessions

## Firestore Collections Structure

### `users` Collection
```
users/
  {userId}/
    email: string
    fullName: string
    rank: string
    unit: string
    division: string
    createdAt: timestamp
```

### `drafts` Collection
```
drafts/
  {userId}/
    userDrafts: object
    updatedAt: timestamp
```

## Troubleshooting

### "Firebase not defined" error
- Make sure you've replaced the placeholder values in `src/firebase.js`
- Ensure Firebase is installed: `npm install firebase`

### Authentication not working
- Check that Email/Password authentication is enabled in Firebase Console
- Verify your Firebase config is correct

### Drafts not syncing
- Ensure Firestore security rules are published
- Check browser console for errors
- Verify you're logged in

### Network errors
- Check your internet connection
- Verify Firebase project is active in console

## Local Development vs Production

For local development, Firebase will work with `localhost`. For production deployment:

1. Add your production domain to Firebase Console
2. Go to **Authentication** â†’ **Settings** â†’ **Authorized domains**
3. Add your domain (e.g., `yourapp.com`)

## Cost

Firebase free tier includes:
- 10K writes/day
- 50K reads/day
- 20K deletes/day
- 1GB storage

This is more than enough for small to medium teams.

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
