# Bondi Wave - Product Requirements Document

## Original Problem Statement
Create a sleek, high-end, minimalistic website for "Bondi Wave" - a premium nose strips brand. Single product focus. Should feel like a high-end sports brand (Nike/Under Armour). Objectives: build brand legitimacy, collect emails for pre-orders/discounts, link to Amazon storefront, link to social media (Instagram, TikTok). Product: $29.95 AUD. Include health benefits section for sleep and sport performance.

## User Personas
1. **Athletes & Fitness Enthusiasts** - Looking to improve breathing performance during workouts
2. **Sleep Quality Seekers** - People experiencing snoring or poor sleep quality
3. **Health-Conscious Consumers** - Interested in medical-grade, hypoallergenic products

## Core Requirements (Static)
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
- [x] Amazon Prime delivery banner

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: Netlify Functions (serverless) + Resend API for emails
- **Database**: N/A (leads pushed to Resend)
- **Fonts**: Oswald (headings), Manrope (body), JetBrains Mono (accents)

## What's Been Implemented
- Full landing page: Hero, Marquee, Features, Product Gallery, Story Section, Science/Benefits, Product Showcase, Sleep Recovery, FAQ, Reviews, Email Signup, Footer
- Promo banner with rotating text (Now Available, Same Day Delivery, 30 Premium Strips)
- Airflow Assessment lead gen modal (profiles A, B, C) with Resend email automation
- List-Unsubscribe headers on Resend API calls
- Mobile-optimized: hand image positioning, touch interactions, responsive layouts
- Desktop: hover-activated science accordion, overlapping hero hand, sticky nav

## Key Files
- `/app/frontend/src/App.js` - Monolithic React component (~1750 lines)
- `/app/frontend/netlify/functions/submission-created.mjs` - Serverless email logic
- `/app/frontend/src/App.css` - Custom animations
- `/app/frontend/src/index.css` - Tailwind config

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
