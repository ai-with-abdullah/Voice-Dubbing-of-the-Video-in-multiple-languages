# Local Setup Guide - Run Dubbio on Your Laptop

This guide explains how to download and run the AI Video Voice Dubbing Platform on your local laptop for expo demonstrations.

---

## Prerequisites

Before starting, make sure you have these installed on your laptop:

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

### 3. Git (Optional but recommended)
- Download from: https://git-scm.com/
- Alternatively, you can download the project as a ZIP file

---

## Step 1: Download the Project

### Option A: Using Git
Open terminal/command prompt and run:
```bash
git clone <your-replit-project-url>
cd ai-video-dubbing
```

### Option B: Download as ZIP from Replit
1. In Replit, click the three dots menu (top right)
2. Click "Download as ZIP"
3. Extract the ZIP file to a folder on your laptop
4. Open terminal/command prompt and navigate to that folder:
   ```bash
   cd path/to/extracted/folder
   ```

---

## Step 2: Install Dependencies

In your terminal, inside the project folder, run:
```bash
npm install
```

This will download all required packages. Wait until it completes (may take 1-2 minutes).

---

## Step 3: Create Environment File

You need to create a file called `.env` in the root folder of the project. This file stores your API keys.

### Create the .env file:

**On Windows:**
1. Open Notepad
2. Save as `.env` (make sure to select "All Files" in save dialog, not "Text Documents")
3. Place it in the main project folder

**On Mac/Linux:**
```bash
touch .env
```

### Add these contents to your .env file:

```bash
# ============================================
# GOOGLE CLOUD APIs (Required for video processing)
# ============================================
GOOGLE_API_KEY=your_google_api_key_here

# ============================================
# ELEVENLABS (Optional - for premium voice cloning)
# ============================================
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# ============================================
# PAYPAL (Optional - only for payment processing)
# ============================================
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here

# ============================================
# EXPO MODE SETTINGS
# ============================================
# Set to 'true' for expo demonstration (recommended for expo)
# This unlocks all features without login/payment
VITE_EXPO_MODE=true

# ============================================
# SESSION (Required - you can use any random string)
# ============================================
SESSION_SECRET=my-super-secret-session-key-12345

# ============================================
# DATABASE (Not needed for local demo)
# ============================================
# Leave empty or remove - app uses in-memory storage
```

---

## Step 4: Get Your Google API Key

This is the most important step. You need a Google Cloud API key for the app to actually process videos.

### Quick Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project**
   - Click on project dropdown (top of page)
   - Click "New Project"
   - Name it: `dubbio-local`
   - Click "Create"

3. **Enable Billing** (Required, but you get $300 free credits)
   - Go to: https://console.cloud.google.com/billing
   - Link a billing account
   - Add payment method

4. **Enable These 3 APIs**
   - Go to: https://console.cloud.google.com/apis/library
   - Search and enable each of these:
     - `Cloud Speech-to-Text API`
     - `Cloud Translation API`
     - `Cloud Text-to-Speech API`

5. **Create API Key**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" > "API Key"
   - Copy the generated key
   - Paste it in your `.env` file as `GOOGLE_API_KEY=your_key_here`

### Free Tier Limits (Good for expo):
| API | Free Per Month |
|-----|----------------|
| Speech-to-Text | 60 minutes |
| Translation | 500,000 characters |
| Text-to-Speech | 4 million characters |

---

## Step 5: Get ElevenLabs API Key (Optional)

For premium voice cloning (highly recommended for expo impressiveness):

1. Go to: https://elevenlabs.io/
2. Sign up for free account
3. Click profile icon (top right) > "Profile + API key"
4. Copy your API key
5. Add to `.env` as `ELEVENLABS_API_KEY=your_key_here`

**Free tier gives you 10,000 characters/month** - enough for expo demos.

---

## Step 6: Run the Application

In your terminal, inside the project folder:

```bash
npm run dev
```

You should see:
```
[express] serving on port 5000
```

---

## Step 7: Open in Browser

Open your web browser and go to:

```
http://localhost:5000
```

You should see the Dubbio homepage!

---

## Expo Mode Settings

For expo demonstrations, your `.env` should have:

```bash
VITE_EXPO_MODE=true
```

This will:
- Hide login/signup buttons
- Hide payment popups
- Unlock all features for demo
- Enable premium voice cloning
- Remove video length limits

---

## Folder Structure (Where Files Go)

```
your-project-folder/
├── .env                    <-- Your API keys go here (create this)
├── client/                 <-- Frontend code
├── server/                 <-- Backend code
├── shared/                 <-- Shared types
├── package.json
├── LOCAL_SETUP_GUIDE.md    <-- This guide
└── SETUP_GUIDE.md          <-- Detailed API setup guide
```

---

## Troubleshooting

### "npm: command not found"
- Node.js is not installed. Download from https://nodejs.org/

### "Port 5000 is already in use"
- Another app is using port 5000. Either:
  - Close that app, or
  - Change the port in `server/index.ts`

### "API key not valid" error
- Check your Google API key is correct in `.env`
- Make sure all 3 Google APIs are enabled
- Check billing is enabled on Google Cloud

### "Module not found" error
- Run `npm install` again

### Application loads but video conversion doesn't work
- Check browser console for errors (F12 > Console tab)
- Verify GOOGLE_API_KEY is set correctly in `.env`
- Make sure the `.env` file is in the root folder (same level as package.json)

### Environment variables not loading
- Make sure `.env` file has no `.txt` extension
- Restart the application after changing `.env`

---

## Quick Checklist for Expo Day

- [ ] Node.js installed on laptop
- [ ] Project downloaded and extracted
- [ ] `npm install` completed successfully
- [ ] `.env` file created with API keys
- [ ] `VITE_EXPO_MODE=true` set in `.env`
- [ ] Google API key added and tested
- [ ] ElevenLabs API key added (for impressive demo)
- [ ] Application runs with `npm run dev`
- [ ] Browser opens to `http://localhost:5000`
- [ ] Test a video conversion before the expo!

---

## Sample .env File (Copy and Edit)

```bash
# Google Cloud API Key (Required)
GOOGLE_API_KEY=AIzaSyB123456789abcdefghijk

# ElevenLabs API Key (Optional but recommended)
ELEVENLABS_API_KEY=sk_123456789abcdefghijk

# Expo Mode - Set to true for demo
VITE_EXPO_MODE=true

# Session Secret (any random string)
SESSION_SECRET=expo-demo-secret-key-2024

# PayPal (leave empty for expo demo)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

---

## Commands Summary

| Command | What It Does |
|---------|--------------|
| `npm install` | Install all packages |
| `npm run dev` | Start the application |
| `npm run build` | Build for production |

---

## Need Help?

If you encounter issues:
1. Check the Troubleshooting section above
2. Read SETUP_GUIDE.md for detailed API setup
3. Check browser console for error messages (F12)

---

*Last Updated: December 2024*
