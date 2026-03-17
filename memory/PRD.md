# Darwaza (دروازة) - Product Requirements Document

## Overview
Darwaza is a comprehensive multi-generational Kuwaiti cultural heritage platform designed to bridge generations through heritage, AI, and modern technology.

## Original Problem Statement
Build a massive, multi-generational cultural platform with:
- Dual Interface Choice (Traditional Heritage vs Modern)
- Heavy Sadu pattern decorations
- AI Integration Hub with 3 models (ChatGPT, Gemini, Claude)
- Multiple core modules for different demographics
- Multilingual support (8 languages)
- Live streaming and AR capabilities

## Architecture
```
/app/
├── backend/
│   ├── server.py          # FastAPI entry point (modular)
│   ├── config.py          # Settings and constants
│   ├── database.py        # MongoDB connection
│   ├── data/              # JSON data files
│   │   ├── arab_data.json # 6 Arab countries with videos/dishes
│   │   └── food_data.json # 8 cooking videos with categories
│   ├── models/            # Pydantic schemas
│   ├── routers/           # API routes (auth, ai, marketplace, etc.)
│   └── utils/             # Helpers (auth, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # Theme, Auth, Language contexts
│   │   └── pages/         # All page components
│   └── public/
└── memory/
    └── PRD.md
```

- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: Emergent LLM Integration (GPT-5.2, Gemini 3, Claude Sonnet 4.5)
- **Auth**: JWT + Emergent Google OAuth
- **Payments**: Stripe (integrated) + K-NET (placeholder)

## User Personas
1. **Elderly Kuwaitis (60+)**: Sell antiques, share oral history, teach traditional crafts
2. **Youth (18-35)**: Learn heritage crafts, design with AI, attend workshops
3. **Children (6-14)**: Gamified learning, heritage boxes, achievement rewards
4. **Foreign Tourists**: Cultural guides, etiquette learning, location info
5. **Arab Diaspora**: Explore pan-Arab cultures and traditions

## Core Requirements (Static)
1. Dual Interface Selection (Heritage/Modern themes)
2. Multi-model AI chat integration
3. Seniors Gateway (Marketplace, Live Councils, Academy)
4. Youth Empowerment (Career paths, Design lab, Workshops)
5. Kids Heritage World (Games, Heritage Box, Achievements)
6. Cooking Corner (Interactive recipes, AR guides)
7. Tourist & Expat Guide
8. Pan-Arab Wing
9. Subscription tiers (Free, Family, Heritage Plus, Premium)
10. Full RTL support for Arabic

## What's Been Implemented

### Phase 1: Backend Refactoring (March 2026) ✅
- [x] Split monolithic server.py (1128 lines) into modular routers
- [x] Created separate router files: auth, ai, marketplace, councils, subscriptions, payments, content, webhooks
- [x] Extracted Pydantic models into models/ directory
- [x] Extracted auth helpers into utils/ directory
- [x] Created config.py for centralized settings
- [x] Created database.py for MongoDB connection management

### Phase 2: Smart Data Architecture (March 2026) ✅
- [x] Created /app/backend/data/food_data.json (8 cooking videos, 5 categories)
- [x] Created /app/backend/data/arab_data.json (6 Arab countries with videos & dishes)
- [x] Updated CookingPage to fetch from /api/content/food-videos
- [x] Updated ArabWorldPage to fetch from /api/content/arab-countries
- [x] Implemented YouTube video player component
- [x] Implemented category filtering for cooking videos
- [x] Implemented country detail panel with video and dish display

### Phase 3: UI/UX & Functionality (March 2026) ✅
- [x] Neo-Heritage design with Sadu patterns
- [x] Dark/Light mode toggle for both themes
- [x] All navigation buttons functional
- [x] Video playback modal with close button

### Previous Implementations (Jan 2026)
- [x] Welcome page with dual interface choice
- [x] Homepage with modules showcase
- [x] AI Hub with 3-model selection (GPT-5.2, Gemini, Claude)
- [x] Seniors Gateway (Marketplace with 8 sample items, Councils, Academy)
- [x] Sell Item Modal with image upload (up to 5 images)
- [x] Host Council Modal with date/time picker
- [x] Live Streaming Infrastructure (start/end/join/leave/chat endpoints)
- [x] Youth Empowerment section
- [x] Kids Heritage World with interactive games
- [x] Mock Payment Page for subscriptions
- [x] Tourists Hub with guides and phrases
- [x] Subscriptions page with 4 tiers (Free, Family 10 KWD, Heritage 25 KWD, Premium 55 KWD)
- [x] Stripe payment integration (Visa/MasterCard)
- [x] K-NET payment option (UI placeholder)
- [x] Authentication (JWT + Google OAuth)
- [x] All 8 languages: Arabic, English, Spanish, French, Japanese, Chinese, Russian, Hindi
- [x] RTL layout support

## API Endpoints

### Content APIs (New)
- `GET /api/content/food-videos` - Returns 8 cooking videos with 5 categories
- `GET /api/content/arab-countries` - Returns 6 Arab countries with videos and dishes
- `GET /api/content/categories` - Returns marketplace categories

### Auth APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - JWT login
- `POST /api/auth/session` - Google OAuth session exchange
- `GET /api/auth/me` - Current user info

### Other APIs
- `GET /api/marketplace/items` - List marketplace items
- `POST /api/marketplace/items` - Create item (auth required)
- `GET /api/subscriptions/plans` - Subscription plans
- `POST /api/payments/checkout` - Create payment session
- `POST /api/councils` - Create live council
- `POST /api/ai/chat` - AI chat endpoint

## Prioritized Backlog

### P0 (Critical) - COMPLETED
- [x] Payment integration (Stripe) ✅
- [x] K-NET payment option (placeholder) ✅
- [x] Live streaming infrastructure ✅
- [x] All languages working (8 languages) ✅
- [x] All buttons functional ✅
- [x] Image upload for marketplace ✅
- [x] Backend refactoring ✅
- [x] Food Corner videos ✅
- [x] Arab World Wing content ✅

### P1 (High Priority)
- [ ] K-NET full integration (requires Kuwaiti bank merchant account)
- [ ] AR viewer integration for 3D heritage models
- [ ] Council real-time video streaming (WebRTC)
- [ ] Course content management for Expertise Academy

### P2 (Medium Priority)
- [ ] Kids achievement tracking and rewards
- [ ] User profile customization
- [ ] Social sharing features
- [ ] Heritage Box subscription management

### P3 (Future)
- [ ] Mobile app (React Native)
- [ ] Offline mode for kids games
- [ ] Virtual museum tours
- [ ] Community forums

## Data Files (Editable by User)

### /app/backend/data/food_data.json
Contains 8 cooking tutorial videos with:
- YouTube video IDs (placeholder - swap with real cooking video IDs)
- 5 categories: Kuwaiti, Gulf, Levantine, Maghrebi, Desserts
- Bilingual titles and descriptions (Arabic/English)

### /app/backend/data/arab_data.json
Contains 6 Arab countries with:
- Kuwait, Saudi Arabia, Egypt, Lebanon, Morocco, UAE
- YouTube video IDs (placeholder - swap with real cultural video IDs)
- National dish for each country with image and description
- Bilingual content (Arabic/English)

## Notes
- YouTube video IDs are placeholders. The user can update them in the JSON files without touching code.
- K-NET requires a Kuwaiti bank merchant account for real integration.
- Live streaming is infrastructure-ready but needs WebRTC provider integration for real video.
