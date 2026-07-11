# ⚡ TAGIT — NFC Digital Business Card Ecosystem

A premium, production-ready **P2P NFC Digital Business Card** platform.

---

## Architecture

```
tagit-nfc-ecosystem/
├── packages/
│   ├── backend/     # Node.js · Express · Prisma ORM · PostgreSQL (Supabase)
│   ├── web/         # Next.js 14 App Router · Tailwind CSS (NFC tap landing page)
│   └── mobile/      # React Native · Expo Router (client dashboard app)
└── package.json     # npm workspaces root
```

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 20.x |
| npm | 10.x |
| PostgreSQL | 15.x (via Supabase) |
| Expo CLI | Latest |

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd tagit-nfc-ecosystem
npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your Supabase credentials

# Web
cp packages/web/.env.example packages/web/.env.local

# Mobile
cp packages/mobile/.env.example packages/mobile/.env
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase (runs migrations)
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend API (http://localhost:4000)
npm run dev:backend

# Terminal 2 — Web Profile (http://localhost:3000)
npm run dev:web

# Terminal 3 — Mobile (Expo DevTools)
cd packages/mobile && npx expo start
```

---

## Subsystem Documentation

### Backend API
- Base URL: `http://localhost:4000/api/v1`
- Auth: JWT Bearer tokens
- Image moderation: AWS Rekognition pipeline (mockup, swap in real keys)
- vCard: `GET /api/v1/profile/:username/vcard`

### Public Web Profile
- NFC tap → `https://yourdomain.com/p/:username`
- Glassmorphism mobile-first UI
- Graceful STEALTH/SUSPENDED handling
- "Add to Contacts" vCard download

### Mobile Dashboard
- Expo Router file-based navigation
- Stealth toggle with haptic feedback
- Link management matrix with live toggle
- AI moderation warning modal

---

## Environment Variables Reference

See each package's `.env.example` for full documentation.

---

## License

MIT © TAGIT Team
