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
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: Emergent LLM Integration (GPT-5.2, Gemini 3, Claude Sonnet 4.5)
- **Auth**: JWT + Emergent Google OAuth

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
9. Subscription tiers (Free, Family, Heritage Plus)
10. Full RTL support for Arabic

## What's Been Implemented (Jan 2026)
- [x] Welcome page with dual interface choice
- [x] Homepage with modules showcase
- [x] AI Hub with 3-model selection (GPT-5.2, Gemini, Claude)
- [x] Seniors Gateway (Marketplace, Councils, Academy tabs)
- [x] Youth Empowerment section
- [x] Kids Heritage World with gamification
- [x] Cooking Corner with recipe cards
- [x] Tourists Hub with guides and phrases
- [x] Pan-Arab Wing with country selector
- [x] Subscriptions page with 3 tiers
- [x] Authentication (JWT + Google OAuth)
- [x] Multilingual support (8 languages)
- [x] Dark/Light mode toggle
- [x] Senior accessibility mode
- [x] Sadu pattern decorations
- [x] RTL layout support

## Prioritized Backlog

### P0 (Critical)
- [ ] Payment integration (Stripe) for subscriptions
- [ ] Live streaming infrastructure for Tale Councils
- [ ] AR viewer integration for 3D heritage models

### P1 (High Priority)
- [ ] Marketplace item listing with images upload
- [ ] Council scheduling and notification system
- [ ] Course content management for Expertise Academy
- [ ] Kids achievement tracking and rewards

### P2 (Medium Priority)
- [ ] User profile customization
- [ ] Social sharing features
- [ ] Recipe video tutorials
- [ ] Heritage Box subscription management

### P3 (Future)
- [ ] Mobile app (React Native)
- [ ] Offline mode for kids games
- [ ] Virtual museum tours
- [ ] Community forums

## Next Tasks
1. Implement Stripe payment for subscriptions
2. Build live streaming infrastructure
3. Create AR viewer component
4. Add file upload for marketplace items
5. Implement notification system
