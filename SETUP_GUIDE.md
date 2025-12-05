# AI Video Voice Dubbing Platform - Complete Setup Guide

This guide provides detailed instructions for obtaining and configuring all required API keys and services for your AI Video Voice Dubbing Platform.

---

## Table of Contents

1. [Overview of Required Services](#overview-of-required-services)
2. [Google Cloud APIs Setup](#google-cloud-apis-setup)
3. [ElevenLabs API Setup](#elevenlabs-api-setup)
4. [PayPal Payment Setup](#paypal-payment-setup)
5. [Stripe Payment Setup (Alternative)](#stripe-payment-setup-alternative)
6. [Environment Variables Configuration](#environment-variables-configuration)
7. [EXPO Mode Configuration](#expo-mode-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Overview of Required Services

| Service | Purpose | Required/Optional | Free Tier Available |
|---------|---------|-------------------|---------------------|
| Google Cloud Speech-to-Text | Convert video audio to text | Required | Yes (60 min/month) |
| Google Cloud Translation | Translate text to 200+ languages | Required | Yes (500K chars/month) |
| Google Cloud Text-to-Speech | Generate dubbed voice | Required | Yes (4M chars/month) |
| ElevenLabs | Premium voice cloning | Optional (Expo/Premium) | Yes (10K chars/month) |
| PayPal | Payment processing | Required for payments | Free to setup |
| Stripe | Alternative payment option | Optional | Free to setup |

---

## Google Cloud APIs Setup

### Step 1: Create a Google Cloud Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account or create one
3. Accept the terms of service

### Step 2: Create a New Project

1. Click on the project dropdown at the top of the page
2. Click "New Project"
3. Enter project name: `ai-video-dubbing` (or any name you prefer)
4. Click "Create"
5. Wait for the project to be created and select it

### Step 3: Enable Billing

> **Important**: Google requires billing to be enabled, but you won't be charged if you stay within free tier limits.

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Click "Link a billing account"
3. Add a payment method (credit/debit card)
4. Google provides $300 free credits for new accounts

### Step 4: Enable Required APIs

Navigate to [APIs & Services > Library](https://console.cloud.google.com/apis/library) and enable these APIs:

#### A. Cloud Speech-to-Text API
1. Search for "Cloud Speech-to-Text API"
2. Click on it
3. Click "Enable"

#### B. Cloud Translation API
1. Search for "Cloud Translation API"
2. Click on it
3. Click "Enable"

#### C. Cloud Text-to-Speech API
1. Search for "Cloud Text-to-Speech API"
2. Click on it
3. Click "Enable"

### Step 5: Create API Key

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" at the top
3. Select "API Key"
4. Your API key will be generated - **COPY IT IMMEDIATELY**
5. Click "Edit API key" to add restrictions (recommended):
   - Under "API restrictions", select "Restrict key"
   - Select these APIs:
     - Cloud Speech-to-Text API
     - Cloud Translation API
     - Cloud Text-to-Speech API
   - Click "Save"

### Google API Free Tier Limits

| API | Free Tier Limit | Overage Cost |
|-----|-----------------|--------------|
| Speech-to-Text | 60 minutes/month | $0.006/15 seconds |
| Translation | 500,000 characters/month | $20 per million chars |
| Text-to-Speech | 4 million characters/month | $4-$16 per million chars |

---

## ElevenLabs API Setup

> **Note**: ElevenLabs is OPTIONAL and used only for premium voice cloning. The platform works with Google TTS by default.

### Step 1: Create Account

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Click "Sign Up" or "Get Started Free"
3. Create account with email or Google

### Step 2: Get API Key

1. After login, click on your profile icon (top right)
2. Click "Profile + API key"
3. Your API key is displayed - click "Copy" icon
4. Keep this key secure!

### ElevenLabs Pricing

| Plan | Price | Characters/Month | Voice Cloning |
|------|-------|------------------|---------------|
| Free | $0 | 10,000 | No |
| Starter | $5/month | 30,000 | Yes (3 voices) |
| Creator | $22/month | 100,000 | Yes (10 voices) |
| Pro | $99/month | 500,000 | Yes (20 voices) |

### When to Use ElevenLabs

- Enable for **Expo demonstrations** (impressive voice cloning)
- Enable for **Premium users** who pay subscription
- Disable for **Free tier** users (use Google TTS instead)

---

## PayPal Payment Setup

### Step 1: Create PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account or create one
3. If creating new account, complete verification

### Step 2: Create Sandbox App (For Testing)

1. Go to [My Apps & Credentials](https://developer.paypal.com/dashboard/applications/sandbox)
2. Click "Create App"
3. Enter App Name: `AI Video Dubbing Platform`
4. Select "Merchant" as app type
5. Click "Create App"

### Step 3: Get Sandbox Credentials (For Testing)

After creating the app:
1. You'll see **Client ID** - copy this
2. Click "Show" under **Secret** - copy this
3. These are your **SANDBOX** credentials for testing

### Step 4: Get Live Credentials (For Production)

1. Go to [Live Applications](https://developer.paypal.com/dashboard/applications/live)
2. Create a new app (same process as sandbox)
3. Get the Live Client ID and Secret
4. **Use these only when going live!**

### PayPal Fees

| Transaction Type | Fee |
|-----------------|-----|
| Standard Rate | 2.9% + $0.30 per transaction |
| International | +1.5% additional |
| Subscription | Same as standard |

### Where to Place PayPal Keys

```
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
```

**For Testing (Sandbox)**: Use sandbox credentials
**For Production (Live)**: Use live credentials

---

## Stripe Payment Setup (Alternative)

> **Note**: Stripe is provided as an alternative. You can integrate it later if needed.

### Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create account with email
3. Verify your email address

### Step 2: Complete Business Profile

1. Go to [Settings](https://dashboard.stripe.com/settings)
2. Complete your business information
3. Add bank account for payouts

### Step 3: Get API Keys

1. Go to [Developers > API Keys](https://dashboard.stripe.com/apikeys)
2. You'll see two keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)
3. For testing, use "Test mode" keys (toggle at top)
4. For production, use "Live mode" keys

### Stripe Fees

| Transaction Type | Fee |
|-----------------|-----|
| Standard Rate | 2.9% + $0.30 per transaction |
| International | +1.5% additional |
| Currency conversion | +1% |

### Where to Place Stripe Keys

```
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### Stripe Availability Note

> **Important for Pakistan**: Stripe does not currently support businesses in Pakistan. You'll need a business entity in a supported country to receive payments. PayPal is recommended for Pakistan-based businesses.

---

## Environment Variables Configuration

### Where to Add Environment Variables in Replit

1. Open your Replit project
2. Click on "Secrets" (lock icon) in the left sidebar
3. Add each variable as a new secret

### Complete List of Environment Variables

```bash
# ============================================
# GOOGLE CLOUD APIs
# ============================================
# Required for Speech-to-Text, Translation, Text-to-Speech
GOOGLE_API_KEY=your_google_api_key_here

# ============================================
# ELEVENLABS (Optional - Premium Voice Cloning)
# ============================================
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# ============================================
# PAYPAL PAYMENT (Primary Payment Method)
# ============================================
# For Testing (Sandbox)
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret

# For Production (Live) - Replace when going live
# PAYPAL_CLIENT_ID=your_live_client_id
# PAYPAL_CLIENT_SECRET=your_live_secret

# ============================================
# STRIPE PAYMENT (Alternative - Optional)
# ============================================
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# ============================================
# APPLICATION SETTINGS
# ============================================
# Set to 'true' for expo/demo mode (hides payment/login)
# Set to 'false' for production (shows all features)
EXPO_MODE=true

# Your website URL (for social sharing and SEO)
BASE_URL=https://your-app-name.replit.app

# Session security (auto-generated, don't change)
SESSION_SECRET=your_session_secret
```

---

## EXPO Mode Configuration

### What is EXPO_MODE?

EXPO_MODE is a toggle that changes the app behavior:

| Feature | EXPO_MODE=true | EXPO_MODE=false |
|---------|----------------|-----------------|
| Login/Signup | Hidden | Visible |
| Subscription Popup | Hidden | Visible |
| Payment Buttons | Hidden | Visible |
| Video Length Limit | Unlimited | 30s (Free), 10min (Paid) |
| Voice Cloning | Enabled (Demo) | Premium Only |
| All Features | Unlocked | Based on subscription |

### When to Use Each Mode

**EXPO_MODE=true** (Demo Mode)
- For expo/exhibition demonstrations
- For investor presentations
- For testing all features
- For development

**EXPO_MODE=false** (Production Mode)
- For live public website
- When accepting real payments
- When enforcing subscription limits

### How to Toggle

In Replit Secrets, simply change:
```
EXPO_MODE=true   # For demo
EXPO_MODE=false  # For production
```

---

## Troubleshooting

### Common Issues

#### 1. Google API Error: "API key not valid"
**Solution**:
- Check if API key is correctly copied (no extra spaces)
- Ensure all 3 APIs are enabled in Google Cloud Console
- Check if billing is enabled on your project

#### 2. Google API Error: "Quota exceeded"
**Solution**:
- You've hit free tier limits
- Wait for monthly reset or upgrade plan
- For production, set up billing alerts

#### 3. ElevenLabs Error: "Unauthorized"
**Solution**:
- Verify API key is correct
- Check if you have remaining character quota
- Free tier may have expired

#### 4. PayPal Error: "Invalid client credentials"
**Solution**:
- Ensure you're using correct environment (Sandbox vs Live)
- Double-check Client ID and Secret
- Make sure app is created in PayPal Developer Dashboard

#### 5. Payment not processing
**Solution**:
- For testing, use PayPal sandbox test accounts
- Create test accounts at [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
- Don't use real credit cards in sandbox mode

### Getting Help

- **Google Cloud**: [Support](https://cloud.google.com/support)
- **ElevenLabs**: [Discord Community](https://discord.gg/elevenlabs)
- **PayPal**: [Developer Support](https://developer.paypal.com/support/)
- **Stripe**: [Documentation](https://stripe.com/docs)

---

## Quick Start Checklist

- [ ] Create Google Cloud account and project
- [ ] Enable Speech-to-Text, Translation, and Text-to-Speech APIs
- [ ] Create and copy Google API Key
- [ ] (Optional) Create ElevenLabs account and get API key
- [ ] Create PayPal Developer account
- [ ] Create PayPal app and get Client ID + Secret
- [ ] Add all keys to Replit Secrets
- [ ] Set EXPO_MODE=true for testing
- [ ] Test the application
- [ ] When ready for production, set EXPO_MODE=false

---

## Cost Estimation

### For Small Scale (< 100 users/month)

| Service | Monthly Cost |
|---------|-------------|
| Google APIs | $0 (within free tier) |
| ElevenLabs | $0-22 |
| PayPal | Transaction fees only |
| Hosting (Replit) | $0-25 |
| **Total** | **$0-47/month** |

### For Medium Scale (100-1000 users/month)

| Service | Monthly Cost |
|---------|-------------|
| Google APIs | $50-200 |
| ElevenLabs | $22-99 |
| PayPal | Transaction fees |
| Hosting | $25-50 |
| **Total** | **$97-349/month** |

---

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use environment variables for all secrets**
3. **Restrict Google API key to specific APIs**
4. **Use PayPal Sandbox for all testing**
5. **Enable Google Cloud billing alerts**
6. **Regularly rotate API keys**
7. **Monitor usage dashboards**

---

*Last Updated: December 2024*
*Version: 1.0*
