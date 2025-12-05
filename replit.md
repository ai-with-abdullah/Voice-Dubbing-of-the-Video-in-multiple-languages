# Dubbio - AI Video Voice Dubbing Platform

## Overview
Dubbio is a full-stack AI-powered video voice dubbing platform that converts video audio into any language supported by Google Translate. The system includes a modern React frontend with a Node.js/Express backend.

## Project Status
- **Current State**: MVP Development Complete
- **Last Updated**: December 2024

## Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Backend (server/)
- **Framework**: Express.js with TypeScript
- **Storage**: In-memory storage (MemStorage)
- **Payment**: PayPal integration
- **APIs**: Routes for video conversion, voice dubbing, and subscriptions

### Shared (shared/)
- **Schema**: TypeScript types and Zod schemas
- **Data Models**: Users, VideoConversions, VoiceDubbings, Subscriptions

## Key Features

### Video Conversion
- Upload videos or paste URLs from 10+ platforms (YouTube, TikTok, Instagram, etc.)
- Auto-detect source language
- Translate to 200+ languages
- Generate dubbed voice (Google TTS or ElevenLabs)
- Export video, audio, and subtitles (SRT/VTT)

### Voice Dubbing Studio
- Record audio via microphone
- Upload audio files
- Live transcription (editable)
- Generate voice in target language
- Playback speed control

### Social Sharing
- Share to Facebook, Twitter, LinkedIn, WhatsApp, Telegram, Reddit, Pinterest
- Copy link functionality
- SEO-optimized shareable links

### Payment (Hidden in EXPO_MODE)
- PayPal integration
- Free tier: 30-second videos, 5/day
- Pro tier: $10/month, 10-minute videos, unlimited

## Environment Variables

### Required
- `SESSION_SECRET`: Session encryption key

### Optional (for full functionality)
- `GOOGLE_API_KEY`: Google Cloud APIs (STT, Translation, TTS)
- `ELEVENLABS_API_KEY`: Premium voice cloning
- `PAYPAL_CLIENT_ID`: PayPal client ID
- `PAYPAL_CLIENT_SECRET`: PayPal secret

### App Configuration
- `VITE_EXPO_MODE`: Set to "true" to hide payment/login features
- `VITE_BASE_URL`: Base URL for shareable links

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── VideoInput.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── VoiceDubbingStudio.tsx
│   │   │   ├── SocialShareButtons.tsx
│   │   │   ├── ConversionProgress.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── PlatformLogos.tsx
│   │   │   ├── LanguageGrid.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── PayPalButton.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx
│   │   │   ├── convert.tsx
│   │   │   ├── studio.tsx
│   │   │   ├── languages.tsx
│   │   │   ├── pricing.tsx
│   │   │   └── not-found.tsx
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   └── App.tsx         # Main app component
│   └── index.html
├── server/
│   ├── routes.ts           # API routes
│   ├── storage.ts          # In-memory storage
│   ├── paypal.ts           # PayPal integration
│   └── index.ts            # Server entry
├── shared/
│   └── schema.ts           # TypeScript schemas
├── SETUP_GUIDE.md          # Comprehensive setup guide
└── design_guidelines.md    # UI/UX guidelines
```

## API Endpoints

### Configuration
- `GET /api/config` - Get app configuration
- `GET /api/stats` - Get conversion statistics
- `GET /api/languages` - Get supported languages
- `GET /api/platforms` - Get supported platforms

### Video Conversion
- `POST /api/convert/video` - Start video conversion
- `GET /api/convert/video/:id` - Get conversion details
- `GET /api/convert/video/:id/status` - Get conversion status

### Voice Dubbing
- `POST /api/voice/generate` - Generate dubbed voice
- `GET /api/voice/:id` - Get voice dubbing details

### Payment (PayPal)
- `GET /api/paypal/setup` - Get PayPal client token
- `POST /api/paypal/order` - Create PayPal order
- `POST /api/paypal/order/:orderID/capture` - Capture payment

### Subscription
- `GET /api/pricing` - Get pricing plans
- `POST /api/subscription/create` - Create subscription
- `GET /api/subscription/:userId` - Get user subscription

## Running the Application

1. Install dependencies: `npm install`
2. Set environment variables in Replit Secrets
3. Run: `npm run dev`
4. Access at port 5000

## EXPO_MODE

When `VITE_EXPO_MODE=true`:
- Login/Signup buttons are hidden
- Pricing section is hidden
- Subscription popups are hidden
- All features are unlocked for demo

When `VITE_EXPO_MODE=false`:
- All features require login
- Payment integration is active
- Video length limits are enforced

## User Preferences
- Dark mode support with system preference detection
- Modern SaaS design with gradient backgrounds
- Inter font family
- Responsive design for all screen sizes
