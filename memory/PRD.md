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

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: Netlify Functions (serverless) + Resend API for emails
- **Database**: N/A (leads pushed to Resend)
- **Fonts**: Oswald (headings), Manrope (body), JetBrains Mono (accents)

## What's Been Implemented
- Full landing page: Hero, Marquee, Features, Product Gallery, Story Section, Science/Benefits, Product Showcase, Sleep Recovery, FAQ, Reviews, Email Signup, Footer
- Promo banner with rotating text (Now Available, Same Day Delivery, 30 Premium Strips)
- Blue delivery marquee (reverse direction) above product gallery
- Airflow Assessment lead gen modal triggered by "Take The Quiz" hero button (no auto-popup)
- List-Unsubscribe headers on Resend API calls
- Mobile-optimized: hand image positioning, thumbnail gallery (5 square 1:1 thumbs), thin feature cards (icon left, text right), collapsible Key Benefits, footer Quick Links + Follow Us side by side
- Desktop: 6 square thumbnails in gallery, hover-activated science accordion, blue glow transition to sleep section, sticky nav
- Animated pricing counters with IntersectionObserver on always-visible section refs
- Performance optimizations: lazy loading, preconnect, preload hero, GPU-accelerated marquees, removed noise overlay, removed unused imports

## Key Files
- `/app/frontend/src/App.js` - Monolithic React component (~1900 lines)
- `/app/frontend/netlify/functions/submission-created.mjs` - Serverless email logic
- `/app/frontend/src/App.css` - Custom animations
- `/app/frontend/src/index.css` - Tailwind config
- `/app/frontend/public/index.html` - Base HTML with preconnect/preload hints

## Prioritized Backlog

### P1 (High Priority)
- [ ] Refactor App.js into smaller components (Hero, ProductGallery, Reviews, FAQ, Benefits, etc.)
- [ ] Add actual TikTok URL when account is created

### P2 (Nice to Have)
- [ ] Analytics tracking (Google Analytics, Meta Pixel)
- [ ] A/B testing for different CTAs
- [ ] Blog/content section
- [ ] Email verification system
- [ ] Admin dashboard to view/export subscribers
