# Darwaza (دروازة) - Product Requirements Document

## Overview
Darwaza is a comprehensive multi-generational Kuwaiti cultural heritage platform designed to bridge generations through heritage, AI, and modern technology.

## Architecture
```
/app/
├── backend/
│   ├── server.py          # FastAPI entry point (modular)
│   ├── config.py          # Settings and constants
│   ├── database.py        # MongoDB connection
│   ├── data/              # JSON data files
│   │   ├── arab_data.json      # 6 Arab countries
│   │   ├── food_data.json      # 8 cooking videos
│   │   └── tourists_data.json  # Complete tourist guide
│   ├── models/            # Pydantic schemas
│   ├── routers/           # API routes
│   └── utils/             # Helpers
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   └── layout/    # Navbar with dropdown menus
│   │   ├── contexts/      # Theme, Auth, Language contexts
│   │   └── pages/         # All page components
│   └── public/
└── memory/
    └── PRD.md
```

## Tech Stack
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: Emergent LLM Integration (GPT-5.2, Gemini 3, Claude Sonnet 4.5)
- **Auth**: JWT + Emergent Google OAuth
- **Payments**: Stripe (integrated) + K-NET (placeholder)

## What's Been Implemented

### Navigation System (March 2026) ✅
- [x] Refactored Navbar with intuitive dropdown menus
- [x] "الأقسام" (Sections) dropdown: Seniors, Youth, Kids
- [x] "استكشف" (Explore) dropdown: Cooking, Tourists, Arab World, Subscriptions
- [x] Mobile responsive navigation with slide-out menu
- [x] Active page highlighting

### Tourist Guide - Real Kuwaiti Content (March 2026) ✅
- [x] **Etiquette & Customs** (4 sections):
  - Greetings & Hospitality - with tips and images
  - Diwaniya Culture - traditions explained
  - Dress Code - guidelines for visitors
  - Ramadan Customs - important practices
- [x] **Traditional Cuisine** (6 dishes):
  - Machboos - national dish with ingredients
  - Jireesh - wheat porridge
  - Margoog - traditional stew
  - Gabout - fish stew
  - Harees - Ramadan favorite
  - Luqaimat - sweet dumplings
- [x] **Tourist Attractions** (6 landmarks):
  - Kuwait Towers - iconic symbol
  - Grand Mosque - architectural marvel
  - Souq Al-Mubarakiya - historic market
  - Failaka Island - archaeological site
  - Sadu House - weaving center
  - Liberation Tower - memorial
- [x] **Social Life** (4 topics):
  - Diwaniya Culture
  - Family Gatherings
  - Celebrations & Holidays
  - Coffee & Hospitality
- [x] **Useful Phrases** (10 expressions with pronunciation)

### Youth Empowerment - Demo Data (March 2026) ✅
- [x] **Courses Tab** with 4 certified courses:
  - Sadu Weaving Fundamentals (65% progress demo)
  - Traditional Dhow Building
  - Heritage Tour Guide Certificate
  - Arabic Calligraphy Mastery
- [x] **Design Lab** with AI Pattern Generator (placeholder)
- [x] **Community Gallery** with sample projects
- [x] **Careers Tab** with 4 job listings:
  - Heritage Tour Guide
  - Sadu Weaving Instructor
  - Museum Curator Assistant
  - Heritage Fashion Designer
- [x] Stats display: Members, Courses, Designs, Placements

### Kids Heritage World - Games (March 2026) ✅
- [x] **6 Interactive Games**:
  1. Memory Game - Find matching Kuwaiti symbols
  2. Heritage Quiz - Test knowledge with 5 questions
  3. Word Scramble - Unscramble Kuwaiti words
  4. Pattern Match - Match symbols to names
  5. Sadu Coloring - Digital coloring activity
  6. Story Time - Heritage stories
- [x] Points system with tracking
- [x] Heritage Box subscription option
- [x] Achievements with progress

### Previous Implementations
- [x] Welcome page with dual interface choice (Heritage/Modern)
- [x] Homepage with modules showcase
- [x] AI Hub with 3-model selection
- [x] Seniors Gateway (Marketplace, Councils, Academy)
- [x] Cooking Corner with 8 video tutorials
- [x] Arab World Wing with 6 countries
- [x] Subscriptions with 4 tiers
- [x] Stripe payment integration
- [x] 8-language support
- [x] RTL layout support

## API Endpoints

### Content APIs
- `GET /api/content/tourists-guide` - Complete tourist guide data
- `GET /api/content/food-videos` - 8 cooking videos
- `GET /api/content/arab-countries` - 6 Arab countries
- `GET /api/content/categories` - Marketplace categories

### Other APIs
- `POST /api/auth/{register,login,session}` - Authentication
- `GET /api/marketplace/items` - Marketplace items
- `GET /api/subscriptions/plans` - Subscription plans
- `POST /api/payments/checkout` - Payment session
- `POST /api/ai/chat` - AI chat endpoint

## Data Files (User Editable)

### /app/backend/data/tourists_data.json
Complete tourist guide with:
- 4 etiquette sections with tips
- 6 traditional dishes with ingredients
- 6 tourist attractions with ratings
- 4 social life topics
- 10 useful phrases with pronunciation

### /app/backend/data/food_data.json
8 cooking videos (YouTube IDs are placeholders)

### /app/backend/data/arab_data.json
6 Arab countries (Kuwait, Saudi, Egypt, Lebanon, Morocco, UAE)

## Prioritized Backlog

### P0 (Critical) - COMPLETED ✅
- [x] Navigation fixes
- [x] Tourist Guide with real content
- [x] Youth page with demo data
- [x] Kids games implementation
- [x] Cooking videos
- [x] Payment integration

### P1 (High Priority)
- [ ] K-NET full integration
- [ ] AR viewer for 3D heritage models
- [ ] WebRTC live streaming for councils
- [ ] Course content management

### P2 (Medium Priority)
- [ ] Kids achievement tracking persistence
- [ ] User profile customization
- [ ] Social sharing features
- [ ] Real YouTube video IDs for cooking

### P3 (Future)
- [ ] Mobile app (React Native)
- [ ] Offline mode for kids games
- [ ] Virtual museum tours
- [ ] Community forums

## Test Results
- **Backend**: 100% (12/12 tests passed)
- **Frontend**: 100% (All features verified)
- **Test Report**: /app/test_reports/iteration_5.json
