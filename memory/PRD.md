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
### Feb 2026 (Fork session — part 7)
- StorySection reels populated with 18 Cloudinary UGC creator videos (the one `.mov`/HEVC source served as `.mp4` for browser support). Each tile has a transparent-blue Instagram handle bubble (bottom-left) linking to instagram.com/<handle> (handles parsed from URL before `-UGC_`).
- Added a video lightbox: click a reel to enlarge (9:16) with prev/next arrows + ←/→ keys; opens with sound auto-unmuted (muted=false + play() on open) and native `controls` for scrub + remute; closes via X / backdrop / Escape. Main carousel tiles autoplay muted; only visible reels play (IntersectionObserver); lightbox pauses carousel while open.
- Click vs drag vs handle-click disambiguated via pointer capture + elementFromPoint (closest [data-ig] → Instagram, else [data-reel-index] → lightbox). VERIFIED: 18 reels, overflow+arrow scroll (0→947), correct IG hrefs, lightbox open/next/prev/close all work.
- NOTE: video playback can't be shown in the headless screenshot tool (open-source Chromium lacks H.264) — verified by config/URL (all 200, avc1); plays in real browsers.

### Feb 2026 (Fork session — part 6)
- StorySection: "and sleepers" added to subtitle; Bondi Beach Cloudinary video (H.264 mp4) as heading-band background with bg-black/55 + gradient overlay and text drop-shadows; reels converted from static grid to draggable/wheel/arrow carousel.
- ProductGallery: payment-logos label removed, logos sit directly under Shop button (`!mt-3`); reduced inter-section padding (ProductGallery pb / StorySection pt) to cut dead space.

### Feb 2026 (Fork session — part 5)
- "The Details" section (`ProductGallery.jsx`): added a "Secure Checkout — We Accept" payment-logos strip below the Shop on Amazon button using user-uploaded `/images/transparent assets/credit card logos.webp` (Visa, Mastercard, Amex, Apple Pay, Google Pay; transparent 4000×1429). Centered, max-w-280px, opacity-80 → 100 on hover. data-testid: payment-methods / payment-logos. Verified rendering. Asset pulled from temporarily-public GitHub repo.

### Feb 2026 (Fork session — part 4)
- Reviews carousel: added wheel/two-finger trackpad scrubbing — native non-passive `wheel` listener on the viewport translates dominant-axis delta (vertical OR horizontal) into horizontal scrub + `preventDefault` (only while pointer is over the carousel). Verified: vertical wheel moved 720px, horizontal trackpad 600px.
- Lightbox: added prev/next arrow buttons (ChevronLeft/Right) + ArrowLeft/ArrowRight keyboard nav to browse review-to-review without closing. Index-based state (`data-index` on cards, wraps modulo 29). data-testids: review-lightbox-prev, review-lightbox-next. Verified open→next→prev cycles correctly.
- USER CONFIRMED: CreatorsHub how-to-apply actioned; Resend now working + templates updated; GitHub integration functional.

### Feb 2026 (Fork session — part 3)
- Reviews carousel upgraded to a JS transform-based engine (`Reviews.jsx`): keeps auto-scroll (reliable mobile + desktop), adds desktop click-and-drag scrubbing via Pointer Events (pointer capture + `touch-action: pan-y`), pauses on hover/drag/modal-open. Removed the now-unused `.animate-reviews-track` CSS block.
- Added click-to-enlarge lightbox: tapping/clicking a review opens a Framer Motion modal with the enlarged 9:16 image so the small testimonial text is readable. Tap-vs-drag disambiguation via a 5px move threshold; lightbox opened from `onPointerUp` using `elementFromPoint` (pointer capture swallows the card click). Closes via X button, Escape, or backdrop click. data-testids: reviews-carousel, review-card-N, review-lightbox, review-lightbox-image, review-lightbox-close.
- VERIFIED (Playwright, desktop 1920px): auto-scroll moves; drag scrubs exactly the dragged distance; drag does NOT open lightbox; tap opens readable lightbox; all 3 close paths work.

### Feb 2026 (Fork session — part 2)
- Reviews carousel: replaced JS `requestAnimationFrame` scrollLeft auto-scroll (was STATIC on mobile) with a CSS keyframe marquee (`animate-reviews-track` / `reviews-slide`, duplicated list, `mr` spacing for seamless loop, pause-on-hover, reduced-motion safe). Verified animating on 390px mobile viewport (moved 166px/2s).
- CreatorsHub `how-to-apply` video: pointed to Emergent-hosted URL (customer-assets... bey3g113_how%20to%20apply.mp4#t=0.1, returns 200) per user request — kept off GitHub.
- Email function (`netlify/functions/submission-created.mjs`): rewrote from unreliable v2 `export default` (no `config` event subscription) to the proven legacy `export const handler` pattern reading `JSON.parse(event.body).payload.data`. Kept valid `template:{id}` send (resend@6.9.1 supports it; discount codes are hard-coded inside the user's published Resend templates). Replaced broken `{{{RESEND_UNSUBSCRIBE_URL}}}` List-Unsubscribe placeholder with a valid mailto header.
- EMAIL ROOT CAUSE (diagnosed): code was structurally fine EXCEPT the v2 handler hybrid (now fixed). Remaining user-side blockers: (1) verify sender domain `bondiwaveaustralia.com` in Resend → Domains (status unknown to user), (2) RESEND_API_KEY already set in Netlify per user. NOT testable in Emergent preview — Netlify Forms + functions only run on Netlify production.
- NOTE: All part-2 code edits live only in the Emergent preview. User must "Save to GitHub" so Netlify auto-deploys them to production.

### Feb 2026 (Fork session — part 1)
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
