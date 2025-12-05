# AI Video Voice Dubbing Platform - Design Guidelines

## Design Approach

**Selected Approach**: Modern SaaS Design System (Linear + Stripe + Vercel fusion)

**Rationale**: This is a utility-focused conversion tool requiring clarity, efficiency, and professional credibility. The design must balance technical functionality with approachable usability for both expo demonstrations and production use.

**Core Principles**:
- Clean, uncluttered interfaces that prioritize user tasks
- Clear information hierarchy for complex workflows
- Professional aesthetic that builds trust for a premium service
- Responsive layouts optimized for all devices

---

## Typography

**Font Stack**:
- **Primary**: Inter (body text, UI elements, forms)
- **Display**: Cal Sans or Clash Display (hero headings only)

**Hierarchy**:
- Hero Headline: text-5xl lg:text-6xl xl:text-7xl, font-bold
- Section Headers: text-3xl lg:text-4xl, font-semibold
- Subsections: text-xl lg:text-2xl, font-medium
- Body Text: text-base lg:text-lg, font-normal
- Captions/Labels: text-sm, font-medium
- Buttons: text-sm lg:text-base, font-semibold

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto px-4 lg:px-8
- Content sections: max-w-6xl mx-auto
- Forms/narrow content: max-w-2xl mx-auto

**Vertical Rhythm**:
- Section padding: py-12 md:py-16 lg:py-24
- Component spacing: space-y-8 to space-y-12
- Tight groupings: space-y-4

---

## Component Library

### Navigation
**Header**: Sticky top navigation with backdrop blur
- Logo left, main nav center, CTA buttons right
- Mobile: Hamburger menu with slide-out drawer
- Include: How It Works, Languages, Pricing, Login/Sign Up (hidden in EXPO_MODE)

### Hero Section
**Layout**: Full-width hero with gradient background treatment (not solid colors)
- Large, compelling headline about AI-powered video dubbing
- Subheadline explaining 200+ languages support
- Primary CTA: "Start Converting" + Secondary: "Watch Demo"
- Hero illustration/image: Modern 3D isometric illustration of video conversion process or abstract waveform visualization
- Trust indicators below CTAs: "10,000+ videos converted" "200+ languages" "Voice cloning technology"

### Video Input Section
**Layout**: Centered card-based interface (max-w-3xl)
- Tabbed interface: "Video URL" and "Upload File" tabs
- URL input: Large input field with icon, supports YouTube, TikTok, Instagram, Facebook, Twitter, LinkedIn, Reddit, Vimeo, Dailymotion, Twitch
- File upload: Drag-and-drop zone with file type indicators (MP4, MOV, MKV, WebM, AVI)
- Auto-detected language display: Read-only badge/pill
- Target language dropdown: Searchable select with flag icons
- "Convert Now" button: Large, prominent, disabled state until target language selected

### Video Player Interface
**Layout**: Theater-mode player with controls panel
- Video player: 16:9 aspect ratio, max-w-5xl centered
- Subtitle overlay: Word-by-word highlighting with smooth transitions
- Control bar below player:
  - Playback speed slider (0.5x to 2x)
  - Download buttons: Video, Audio, Subtitles (.SRT, .VTT)
  - Share buttons: Facebook, Twitter, LinkedIn, WhatsApp, Telegram, Reddit, Pinterest (icon row)
- Processing status: Progress bar with step indicators during conversion

### Voice Dubbing Studio
**Layout**: Two-column layout (input left, output right) on desktop, stacked on mobile
- Left Panel:
  - Mic recording button with waveform visualization
  - Audio file upload zone
  - Live transcription display (editable textarea)
  - Language selector
- Right Panel:
  - Generated voice preview player
  - Playback controls
  - Download audio button
  - Voice quality toggle (Standard/Premium with ElevenLabs badge)

### Features Section
**Layout**: 3-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
- Feature cards with icons from Heroicons
- Cards include: Auto Language Detection, 200+ Languages, Voice Cloning, Word-Level Subtitles, Social Sharing, Fast Processing
- Each card: Icon, title, short description
- Spacing: gap-8

### Social Proof Section
**Layout**: Multi-element section
- Conversion counter: Large animated number "Videos converted today"
- Platform logos: Supported platforms grid (2-column on mobile, 6-column on desktop)
- Testimonials: 2-column cards with user quote, name, use case

### Pricing Section (Hidden in EXPO_MODE)
**Layout**: Centered pricing cards (max-w-5xl)
- Two-tier pricing: Free Demo and Pro ($10/month)
- Cards side-by-side on desktop, stacked on mobile
- Feature comparison list with checkmarks
- Primary CTA on Pro card

### Footer
**Layout**: Multi-column footer with newsletter signup
- Newsletter section at top: Email input + Subscribe button
- 4-column grid: Product, Resources, Legal, Connect
- Social media icons
- Copyright and language selector at bottom

---

## Form Elements

**Input Fields**: 
- Height: h-12
- Padding: px-4
- Border radius: rounded-lg
- Focus state: ring-2 ring-offset-2

**Buttons**:
- Primary: h-12 px-8 rounded-lg font-semibold
- Secondary: h-10 px-6 rounded-lg font-medium
- Icon buttons: h-10 w-10 rounded-full

**Dropdowns/Selects**:
- Custom styled select with search functionality
- Flag icons for language options
- Max height with scroll for long lists

---

## Animations

**Minimal, purposeful animations only**:
- Hero: Subtle fade-in on load (duration-700)
- Cards: Slight scale on hover (scale-105) with transition-transform
- Processing: Smooth progress bar animation
- Subtitle highlighting: Gentle background fade (duration-300)
- NO scroll-triggered animations, NO parallax

---

## Images

**Hero Section**: 
- Modern 3D isometric illustration showing video transformation process
- Alternative: Abstract waveform/audio visualization with language flags
- Placement: Right side on desktop (50% width), above content on mobile

**Feature Icons**: Use Heroicons via CDN - solid style for filled look

**Platform Logos**: Real platform logos for supported services (YouTube, TikTok, etc.)

**Social Proof**: Placeholder avatar images for testimonials

---

## Accessibility

- All interactive elements: Minimum 44x44px touch targets
- Form inputs: Associated labels with htmlFor
- Video player: Full keyboard navigation support
- Skip navigation link for screen readers
- ARIA labels on all icon-only buttons
- High contrast text throughout