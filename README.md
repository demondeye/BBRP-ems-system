# VicPol Paperwork - React + Vite + Firebase

A professional arrest report and paperwork tool with cloud authentication and data sync using Firebase.

## Features

- âœ… Multiple report types (Arrest, Warrants, Traffic, Field Contact, Search & Seizure)
- âœ… **Firebase Authentication** - Secure cloud login system
- âœ… **Cloud Sync** - Drafts sync across all devices
- âœ… OCR support for extracting information from screenshots
- âœ… 100+ pre-defined charges with search and filtering
- âœ… Draft management with cloud storage
- âœ… Auto-save functionality
- âœ… PDF export
- âœ… Copy to clipboard
- âœ… Dark theme with gradient background
- âœ… Fully responsive design
- âœ… Auto-populate officer details

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Firebase** - Authentication and cloud database
- **Tailwind CSS** - Styling
- **Tesseract.js** - OCR for image text extraction
- **jsPDF** - PDF generation
- **Firestore** - Cloud database for drafts and user profiles

## Quick Start

### 1. Firebase Setup (Required)

Before running the app, you **must** set up Firebase. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

Quick setup:
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy your Firebase config to `src/firebase.js`

### 2. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
vicpol-react/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Header.jsx
â”‚   â”‚   â”œâ”€â”€ OffenderFields.jsx
â”‚   â”‚   â”œâ”€â”€ OCRUpload.jsx
â”‚   â”‚   â”œâ”€â”€ ChargeSelector.jsx
â”‚   â”‚   â”œâ”€â”€ DraftManager.jsx
â”‚   â”‚   â””â”€â”€ ReportPreview.jsx
â”‚   â”œâ”€â”€ constants/
â”‚   â”‚   â””â”€â”€ charges.js
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â””â”€â”€ helpers.js
â”‚   â”œâ”€â”€ App.jsx
â”‚   â”œâ”€â”€ main.jsx
â”‚   â””â”€â”€ index.css
â”œâ”€â”€ index.html
â”œâ”€â”€ vite.config.js
â”œâ”€â”€ tailwind.config.js
â”œâ”€â”€ postcss.config.js
â””â”€â”€ package.json
```

## Usage

### First Time Setup

1. **Create Account**
   - Open the app
   - Click "Don't have an account? Sign up"
   - Enter email, password, and officer details
   - Auto-logged in after signup

2. **Fill Reports**
   - Officer details are auto-populated from your profile
   - Select report type
   - Fill in offender details
   - Optionally use OCR to auto-fill from screenshots
   - Select charges from the comprehensive list
   - Add confiscated items and officers involved
   - Write the report narrative
   - Save as draft (syncs to cloud)
   - Export as PDF or copy to clipboard

### Returning Users

1. Sign in with your email and password
2. Your drafts automatically sync from the cloud
3. All your officer details are auto-filled

### Cloud Features

- ðŸ” **Secure Authentication** - Firebase handles all security
- â˜ï¸ **Cloud Sync** - Drafts sync across all devices in real-time
- ðŸ“± **Multi-Device** - Sign in on any device and access your drafts
- ðŸ’¾ **Auto-Backup** - All data backed up to Firebase cloud
- ðŸ”„ **Session Persistence** - Stay logged in across browser sessions

## Key Features

### OCR Support
Paste or drop screenshots to automatically extract:
- Name
- Date of Birth
- Sex
- Home Address
- Phone Number

### Draft Management
- Save multiple drafts locally
- Load previous drafts
- Auto-save as you type
- No server required - all data stays in your browser

### Charge Database
100+ charges across categories:
- Assault
- Conduct
- Custody
- Theft
- Traffic
- Weapons
- Drugs
- Fraud
- Court
- Other

## Notes

- All user data is securely stored in Firebase cloud
- Authentication handled by Firebase Auth
- Drafts sync across all devices automatically
- Works offline (with limitations) - drafts save locally until reconnected
- Privacy-focused - only you can access your data
- Free tier supports small to medium teams

## Security

- Firebase Authentication ensures secure login
- Firestore security rules protect user data
- Each user can only access their own drafts and profile
- Passwords are hashed and never stored in plain text
- HTTPS encryption for all data transmission
