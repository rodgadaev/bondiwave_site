# Bondi Wave - Product Requirements Document

## Original Problem Statement
Create a sleek, high-end, minimalistic website for "Bondi Wave" - a premium nose strips brand. Single product focus. Should feel like a high-end sports brand (Nike/Under Armour). Objectives: build brand legitimacy, collect emails for pre-orders/discounts (product dropping March 2026), link to Amazon storefront, link to social media (Instagram, Facebook, TikTok). Product: $29.95 AUD. Include health benefits section for sleep and sport performance.

## User Personas
1. **Athletes & Fitness Enthusiasts** - Looking to improve breathing performance during workouts
2. **Sleep Quality Seekers** - People experiencing snoring or poor sleep quality
3. **Health-Conscious Consumers** - Interested in medical-grade, hypoallergenic products

## Core Requirements (Static)
- [x] Premium, minimalistic design matching Nike/Under Armour aesthetic
- [x] Dark mode only with brand colors (Black #050505, Cyan #00B4D8)
- [x] Email collection for waitlist/pre-orders
- [x] Countdown to March 2026 launch
- [x] Health benefits section (sport & sleep)
- [x] Social media links (Instagram, Facebook, TikTok)
- [x] Amazon storefront link
- [x] Product showcase with pricing ($29.95 AUD)

## What's Been Implemented
**Date: February 6, 2026**
- Landing page with hero section, "Now Available" badge, Shop Now CTA
- Navigation with logo, Instagram link, Shop button (Amazon)
- Animated marquee with product features
- Features section (Medical Grade, Sweat Proof, Hypo Allergenic, Instant Results)
- Benefits section (Sport & Sleep benefits with scientific quotes)
- Product showcase with pricing ($29.95 AUD, $1.00/strip)
- Email subscription form (newsletter/offers) with Netlify Forms
- Footer with social links (Instagram, TikTok) and quick links
- Framer Motion animations throughout
- Responsive design for mobile/desktop
- Brand assets integrated (logo, product box images)
- Airflow Assessment lead gen modal with profile-based Resend emails
- Promo banner linking to Amazon storefront
- Site updated from pre-launch (waitlist/countdown) to launched state (Shop Now, available)

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI
- **Database**: MongoDB (email subscriptions collection)
- **Fonts**: Oswald (headings), Manrope (body), JetBrains Mono (accents)

## API Endpoints
- `POST /api/subscribe` - Add email to waitlist
- `GET /api/subscribers/count` - Get total subscriber count

## Prioritized Backlog

### P0 (Critical) - COMPLETED
- All P0 features delivered

### P1 (High Priority) - Future
- [x] Add actual Instagram URL (https://www.instagram.com/thebondiwave/)
- [x] Add actual Amazon storefront URL (https://www.amazon.com.au/dp/B0GR5HX9PJ)
- [x] Transition site from pre-launch to launched state
- [ ] Add actual TikTok URL when account is created
- [ ] Email verification system
- [ ] Admin dashboard to view/export subscribers

### P2 (Nice to Have) - Future
- [ ] Email marketing integration (Mailchimp/ConvertKit)
- [ ] Analytics tracking (Google Analytics, Meta Pixel)
- [ ] A/B testing for different CTAs
- [ ] Blog/content section
- [ ] FAQs section
- [ ] Contact form

## Next Tasks
1. Update placeholder social media links with actual URLs
2. Connect Amazon storefront when available
3. Consider adding email marketing integration for launch campaigns
