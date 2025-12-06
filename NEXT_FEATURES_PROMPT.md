# Prompt for Next Chat Session - New Features to Add

Copy and paste this prompt into a new chat session to add these advanced features to the Dubbio AI Video Dubbing Platform.

---

## Prompt:

I have an AI Video Dubbing Platform (Dubbio) that I'm presenting at an expo. I want to add these advanced features to make it stand out from my classmates' projects. Please implement the following features:

### 1. Voice Preview Samples
- Add a voice preview section in the Voice Studio where users can hear sample clips of each available voice before selecting
- Show a small audio player next to each voice option in the dropdown/selector
- Include 2-3 sample phrases in different languages for each voice

### 2. Subtitle Download (SRT/VTT)
- After generating dubbed audio, allow users to download subtitles in SRT and VTT formats
- Generate timestamped subtitles from the translated text
- Add download buttons for both formats next to the audio player
- Include proper timing based on audio duration

### 3. Voice Speed and Pitch Control
- Add sliders for adjusting voice speed (0.5x to 2.0x)
- Add sliders for adjusting voice pitch (-50% to +50%)
- Apply these settings when generating the dubbed voice
- Show real-time preview of settings

### 4. Voice Comparison Side-by-Side
- Create a comparison view where users can generate the same text in 2-3 different voices
- Display audio players side by side for easy comparison
- Allow quick switching between voices to find the best match
- Add a "Compare Voices" button in the Voice Studio

### 5. Waveform Visualization
- Display an animated waveform while audio is playing
- Show the audio waveform visually in the audio player
- Add visual feedback when voice is being generated
- Use a modern, sleek waveform design

### 6. Share to Social Media
- Add share buttons for Twitter/X, Facebook, LinkedIn, and WhatsApp
- Allow users to share their dubbed audio or video results
- Generate shareable links with preview cards
- Include "Copy Link" functionality

### 7. Batch Video/Text Conversion
- Allow users to queue multiple texts or files for conversion
- Show a queue/list of items being processed
- Display progress for each item in the batch
- Add estimated time remaining for the batch

---

## Technical Notes:

- The project uses React, TypeScript, Express, and TailwindCSS with shadcn/ui components
- Voice generation uses ElevenLabs API (already integrated in `server/elevenlabs.ts`)
- The Voice Studio page is at `client/src/pages/studio.tsx`
- Use the existing UI components from `@/components/ui/`
- Follow the existing code patterns and styling

## Priority Order:
1. Waveform Visualization (most visually impressive for demos)
2. Voice Preview Samples (helps users understand the voices)
3. Voice Speed/Pitch Control (shows advanced customization)
4. Voice Comparison (unique feature)
5. Subtitle Download (practical feature)
6. Share to Social Media (engagement feature)
7. Batch Conversion (power user feature)

Please implement these features one at a time, starting with the highest priority. Test each feature before moving to the next.
