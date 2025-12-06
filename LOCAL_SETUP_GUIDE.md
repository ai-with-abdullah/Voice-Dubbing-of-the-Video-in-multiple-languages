# Local Setup Guide - Run Dubbio on Your Laptop (ElevenLabs Only)

This guide explains how to download and run the AI Video Voice Dubbing Platform on your local laptop for expo demonstrations using **only ElevenLabs API** (no Google Cloud required).

---

## Quick Start (5 Minutes)

For the expo, you only need **ElevenLabs API key** - no Google Cloud billing required!

---

## Prerequisites

### 1. Node.js (Required)
- Download from: https://nodejs.org/
- **Recommended version**: Node.js 20 LTS or higher
- To check if installed, open terminal/command prompt and type:
  ```bash
  node --version
  ```
  You should see something like `v20.x.x`

### 2. npm (Comes with Node.js)
- Check if installed:
  ```bash
  npm --version
  ```

---

## Step 1: Download the Project

### Option A: Download as ZIP from Replit (Recommended)
1. In Replit, click the three dots menu (top right)
2. Click "Download as ZIP"
3. Extract the ZIP file to a folder on your laptop
4. Open terminal/command prompt and navigate to that folder:
   ```bash
   cd path/to/extracted/folder
   ```

### Option B: Using Git
```bash
git clone <your-replit-project-url>
cd ai-video-dubbing
```

---

## Step 2: Install Dependencies

In your terminal, inside the project folder, run:
```bash
npm install
```

Wait until it completes (may take 1-2 minutes).

---

## Step 3: Get Your ElevenLabs API Key (FREE - No Credit Card Required!)

This is the only API key you need for the expo demo!

### How to Get It:

1. **Go to ElevenLabs**
   - Visit: https://elevenlabs.io/

2. **Create Free Account**
   - Click "Sign Up" or "Get Started Free"
   - Sign up with email or Google account
   - **No credit card required!**

3. **Get Your API Key**
   - After login, click on your profile icon (top right corner)
   - Click "Profile + API key"
   - You'll see your API key - click the copy icon
   - **Save this key - you'll need it in the next step!**

### Free Tier Limits:
| Feature | Free Limit |
|---------|------------|
| Characters | 10,000 per month |
| Voice Generation | Unlimited requests |
| Languages | 29+ languages |

**10,000 characters is enough for many expo demos!**

---

## Step 4: Create Environment File (.env)

Create a file called `.env` in the root folder of your project.

### On Windows:
1. Open Notepad
2. Copy the content below
3. Save as `.env` (select "All Files" in save dialog, NOT "Text Documents")
4. Make sure to save in the main project folder (same level as package.json)

### On Mac/Linux:
```bash
touch .env
nano .env   # or use any text editor
```

### Paste This Content into .env:

```bash
# ============================================
# ELEVENLABS API KEY (Required for voice generation)
# Get your free key from: https://elevenlabs.io/
# ============================================
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# ============================================
# EXPO MODE (Set to true for expo demo)
# ============================================
VITE_EXPO_MODE=true
EXPO_MODE=true

# ============================================
# SESSION SECRET (any random string)
# ============================================
SESSION_SECRET=expo-demo-secret-key-2024
```

**Replace `your_elevenlabs_api_key_here` with your actual ElevenLabs API key!**

---

## Step 5: Run the Application

In your terminal, inside the project folder:

```bash
npm run dev
```

You should see:
```
[express] serving on port 5000
```

---

## Step 6: Open in Browser

Open your web browser and go to:

```
http://localhost:5000
```

You should see the Dubbio homepage!

---

## Step 7: Test Voice Generation

1. Click on "Voice Studio" in the navigation
2. Type some text in the input box
3. Select a target language
4. Click "Generate Voice"
5. You should hear the generated audio!

If it works, you're ready for the expo!

---

## What Works with ElevenLabs Only

| Feature | Status |
|---------|--------|
| Voice Generation (Text-to-Speech) | Works |
| Multiple Languages (29+) | Works |
| Premium Voice Quality | Works |
| Voice Studio Demo | Works |
| Video Upload UI | Shows (demo mode) |
| Full Video Conversion | Needs Google API (later) |

**For expo demos, the Voice Studio is the most impressive feature!**

---

## Folder Structure

```
your-project-folder/
├── .env                    <-- Your API key goes here (create this!)
├── client/                 <-- Frontend code
├── server/                 <-- Backend code  
├── shared/                 <-- Shared types
├── public/
│   └── audio/              <-- Generated audio files saved here
├── package.json
└── LOCAL_SETUP_GUIDE.md    <-- This guide
```

---

## Troubleshooting

### "npm: command not found"
- Node.js is not installed
- Download from: https://nodejs.org/

### "Port 5000 is already in use"
- Another app is using port 5000
- Close that app and try again
- Or on Mac, disable AirPlay Receiver in System Settings

### "ElevenLabs API key not configured"
- Check your `.env` file exists in the root folder
- Make sure ELEVENLABS_API_KEY is set correctly
- Restart the app after changing `.env`

### "Module not found" error
- Run `npm install` again

### Voice generation not working
- Check browser console for errors (F12 > Console tab)
- Verify your ElevenLabs API key is correct
- Check if you have characters remaining in your ElevenLabs account

### .env file not working on Windows
- Make sure file is named exactly `.env` (not `.env.txt`)
- In Notepad, use "Save as type: All Files (*.*)"

---

## Quick Checklist for Expo Day

- [ ] Node.js installed on laptop
- [ ] Project downloaded and extracted
- [ ] `npm install` completed successfully
- [ ] ElevenLabs account created (free)
- [ ] API key copied from ElevenLabs
- [ ] `.env` file created with API key
- [ ] Application runs with `npm run dev`
- [ ] Browser opens to `http://localhost:5000`
- [ ] Voice generation tested and working!

---

## Sample .env File (Copy and Edit)

```bash
# ElevenLabs API Key (Get from https://elevenlabs.io/)
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Expo Mode - Enables all features for demo
VITE_EXPO_MODE=true
EXPO_MODE=true

# Session Secret
SESSION_SECRET=expo-demo-2024
```

---

## Commands Summary

| Command | What It Does |
|---------|--------------|
| `npm install` | Install all packages |
| `npm run dev` | Start the application |

---

## Demo Mode (EXPO_MODE) Settings

The app has an "Expo Mode" that hides certain features like pricing and login for demo purposes.

### Enable/Disable Expo Mode in Replit:

1. Go to the **Secrets** tab in Replit (lock icon in the left sidebar)
2. Add or edit these secrets:
   - `EXPO_MODE` = `true` (for expo demo) or `false` (for production)
   - `VITE_EXPO_MODE` = `true` (for expo demo) or `false` (for production)
3. Restart the application

### Enable/Disable Expo Mode Locally:

Edit your `.env` file:

```bash
# For Expo Demo (hides pricing, login, signup):
VITE_EXPO_MODE=true
EXPO_MODE=true

# For Production Mode (shows all features):
VITE_EXPO_MODE=false
EXPO_MODE=false
```

| Mode | Pricing | Login/Signup | Best For |
|------|---------|--------------|----------|
| Expo Mode (`true`) | Hidden | Hidden | Class demos, presentations |
| Production Mode (`false`) | Visible | Visible | Real deployment |

---

## Setting Up Google OAuth Authentication (Optional)

For real user authentication with Google Sign-In:

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** > **OAuth consent screen** and configure it

### Step 2: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   - For local: `http://localhost:5000/api/auth/google/callback`
   - For Replit: `https://your-repl-name.your-username.repl.co/api/auth/google/callback`
5. Copy the **Client ID** and **Client Secret**

### Step 3: Add to Environment
```bash
# Add to your .env file
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## Setting Up Apple Authentication (Optional)

For Apple Sign-In (requires Apple Developer Account - $99/year):

### Step 1: Configure in Apple Developer Portal
1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **App ID** with Sign In with Apple enabled
4. Create a **Services ID** for web authentication
5. Configure the web domain and return URLs

### Step 2: Generate Keys
1. Create a private key for Sign In with Apple
2. Download the `.p8` key file
3. Note your Key ID, Team ID, and Services ID

### Step 3: Add to Environment
```bash
# Add to your .env file
APPLE_CLIENT_ID=your_services_id
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=contents_of_p8_file
```

**Note:** Apple Sign-In requires HTTPS, so it won't work on localhost without additional setup.

---

## Adding Google API Later (For Full Video Conversion)

When you get Google Cloud billing working, you can add:

```bash
# Add to your .env file
GOOGLE_API_KEY=your_google_api_key_here
```

This will enable full video-to-video conversion with:
- Speech-to-Text (extract audio from video)
- Translation (translate to any language)
- Text-to-Speech (generate dubbed audio)

---

## Supported Languages

ElevenLabs supports 29+ languages including:
- English, Spanish, French, German, Italian
- Portuguese, Polish, Russian, Japanese, Korean
- Chinese, Arabic, Hindi, Turkish, Dutch
- And many more!

---

*Last Updated: December 2024*
*Simplified for Expo Demo with ElevenLabs Only*
