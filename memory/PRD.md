# Bondi Wave - Product Requirements Document

## Original Problem Statement
Create a sleek, high-end, minimalistic website for "Bondi Wave" - a premium nose strips brand. Single product focus. Should feel like a high-end sports brand (Nike/Under Armour). Objectives: build brand legitimacy, collect emails for pre-orders/discounts, link to Amazon storefront, link to social media (Instagram, TikTok). Product: $29.95 AUD. Include health benefits section for sleep and sport performance.

## User Personas
1. **Athletes & Fitness Enthusiasts** - Looking to improve breathing performance during workouts
2. **Sleep Quality Seekers** - People experiencing snoring or poor sleep quality
3. **Health-Conscious Consumers** - Interested in medical-grade, hypoallergenic products

## Core Requirements
- [x] Premium, minimalistic design matching Nike/Under Armour aesthetic
- [x] Dark mode only with brand colors (Black #050505, Cyan #00B4D8)
- [x] Email collection for waitlist/pre-orders
- [x] Health benefits section (sport & sleep)
- [x] Social media links (Instagram, TikTok)
- [x] Amazon storefront link
- [x] Product showcase with pricing ($29.95 AUD)
- [x] Airflow Assessment lead gen modal with profile-based Resend emails
- [x] List-Unsubscribe headers on all Resend email calls
- [x] Interactive product gallery, reviews carousel, FAQ, science accordion
- [x] Animated pricing counters ($29.95 and $1/strip)
- [x] Amazon Prime delivery marquee banner
- [x] Modular component architecture (App.js refactored)

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion (modular component structure)
- **Backend**: Netlify Functions (serverless) + Resend API for emails
- **Database**: N/A (leads pushed to Resend)
- **Fonts**: Oswald (headings), Manrope (body), JetBrains Mono (accents)

## Component Architecture (Refactored Apr 2026)
```
/app/frontend/src/
├── App.js                    # Thin orchestrator (~57 lines)
├── App.css                   # Custom CSS animations
├── index.css                 # Tailwind configuration
├── constants.js              # ASSETS, SOCIAL_LINKS, fadeUp
├── hooks.js                  # useAssessmentModal, useCountUp
└── components/
    ├── AssessmentModal.jsx   # Multi-step quiz modal
    ├── Benefits.jsx          # Sleep/Sport science accordions
    ├── DeliveryBanner.jsx    # Blue reverse-scrolling marquee
    ├── EmailSignup.jsx       # Newsletter signup form
    ├── FAQ.jsx               # Collapsible FAQ with show more
    ├── Features.jsx          # 4 auto-cycling feature cards
    ├── Footer.jsx            # 3-column footer
    ├── Hero.jsx              # Hero section with CTAs
    ├── Marquee.jsx           # Feature keywords marquee
    ├── MobileKeyBenefits.jsx # Mobile-only collapsible benefits
    ├── Navigation.jsx        # Sticky nav with glass effect
    ├── ProductGallery.jsx    # Amazon-style image gallery
    ├── ProductShowcase.jsx   # Price display with counters
    ├── PromoBanner.jsx       # Top promo scrolling banner
    ├── Reviews.jsx           # Auto-scrolling reviews carousel
    ├── SleepRecovery.jsx     # Full-width SVG image section
    ├── StorySection.jsx      # Brand story with videos
    └── TikTokIcon.jsx        # Custom TikTok SVG icon
```

## What's Been Implemented
- Full landing page: Hero, Marquee, Features, Product Gallery, Story Section, Science/Benefits, Product Showcase, Sleep Recovery, FAQ, Reviews, Email Signup, Footer
- Promo banner with rotating text (Now Available, Same Day Delivery, 30 Premium Strips)
- Blue delivery marquee (reverse direction) above product gallery
- Airflow Assessment lead gen modal triggered by "Take The Quiz" hero button (no auto-popup)
- List-Unsubscribe headers on Resend API calls
- Mobile-optimized: hand image positioning, thumbnail gallery (5 square 1:1 thumbs), thin feature cards (icon left, text right), collapsible Key Benefits, footer Quick Links + Follow Us side by side
- Desktop: 6 square thumbnails in gallery, hover-activated science accordion, blue glow transition to sleep section, sticky nav
- Animated pricing counters with IntersectionObserver on always-visible section refs
- Performance optimizations: lazy loading, preconnect, preload hero, GPU-accelerated marquees, removed noise overlay
- **COMPLETED: Full component refactoring** - App.js reduced from ~1900 lines to ~57 lines, split into 18 components + constants + hooks

## Key Files
- `/app/frontend/src/App.js` - Thin orchestrator importing all components
- `/app/frontend/src/constants.js` - Shared constants (ASSETS, SOCIAL_LINKS, fadeUp)
- `/app/frontend/src/hooks.js` - Custom hooks (useAssessmentModal, useCountUp)
- `/app/frontend/src/components/` - 18 modular component files
- `/app/frontend/netlify/functions/submission-created.mjs` - Serverless email logic
- `/app/frontend/src/App.css` - Custom animations
- `/app/frontend/src/index.css` - Tailwind config
- `/app/frontend/public/index.html` - Base HTML with preconnect/preload hints

## Changelog
### Feb 2026 (Fork session)
- Synced preview pod to GitHub `main` branch (private repo, temporarily made public to pull). Copied 6 asset-migrated source files (Benefits, CreatorsHub, ProductGallery, SleepRecovery, StorySection, constants.js) + new public asset folders (`images/carousel`, `images/transparent assets`, `images/creators hub assets`, `images/reviews` x30, `videos/`).
- VERIFIED (visual screenshots): main page hero + Reviews carousel render with local `/images/reviews/` photos; `/creators` Creators Hub loads with video player + content cards, 0 broken images.
- KNOWN ISSUE: `/videos/how-to-apply.mp4` is only 2 bytes (empty/corrupt) in the GitHub repo itself — needs re-commit. Will render blank in Creators Hub "How to Apply" spot.
- PENDING (awaiting user input): Resend email automation work — user wants to proceed but hasn't yet confirmed (a) Netlify vs FastAPI backend, (b) template authoring approach, (c) Resend API key + verified sender domain. Note: current Netlify function uses `template:{id}` which is NOT part of Resend's standard send API.

## Prioritized Backlog

### P1 (High Priority)
- [x] Refactor App.js into smaller components (completed Apr 2026)
- [ ] Add actual TikTok URL when account is created

### P2 (Nice to Have)
- [ ] Analytics tracking (Google Analytics, Meta Pixel)
- [ ] A/B testing for different CTAs
- [ ] Blog/content section
- [ ] Email verification system
- [ ] Admin dashboard to view/export subscribers
