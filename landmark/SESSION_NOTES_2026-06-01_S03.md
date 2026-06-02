# PDN Truck Marketplace — Session S03
**Date:** 2026-06-01
**Status:** LIVE on Railway

---

## What Was Built This Session

### 1. Railway Backend (search-api)
- **Repo:** `https://github.com/juancarlosfel52/-pdn-search-api`
- **Live URL:** `https://pdn-search-api-production.up.railway.app`
- Switched from ScraperAPI (429 rate limit) → **Serper.dev** (Google search results)
- Fixed Craigslist category from `ttt` (auto parts) → `hva` (heavy vehicles)
- Added **SSE streaming** endpoint `/search/stream` — results appear city by city
- Added **`/detail?url=`** endpoint — fetches listing page, extracts images + contact info using Claude Haiku
- Sequential city fetching to avoid rate limits

### 2. Railway Frontend (truck-marketplace)
- **Repo:** `https://github.com/juancarlosfel52/pdn-search-api`
- **Live URL:** `https://pdn-search-api-production-4ce5.up.railway.app`
- Full site deployed as static Express server

### 3. Mobile Nav — 3-Tab Side Panel
- Hamburger opens side drawer with 3 tabs: **Browse / Services / Account**
- Each tab has icons, section headers, CTA buttons
- Updated in ALL 9 HTML pages + `css/main.css` + `js/main.js`

### 4. Truck Search (truck-search.html)
- Uses Serper.dev via Railway API — real Google search results
- Live streaming: cards pop in as each search batch returns
- Bouncing result count badge in corner
- Filters (city, price, year) now **re-trigger search** with enriched query
- `/detail` endpoint loads photos + AI-extracted contact info when modal opens
- `buildQuery()` bakes filter values into search terms

### 5. Dashboard — Photo Upload
- Add Truck form: **Exterior Photos** + **Interior Photos** (up to 8 each)
- Edit Truck: same photo grids, pre-fills existing photos from Firestore
- Photos stored as base64 in Firestore under `photos.exterior[]` and `photos.interior[]`
- `photoState` and `editPhotoState` objects manage in-memory state

### 6. Public Listings Page (listings.html) — NEW
- **URL:** `/listings.html`
- Pulls ALL trucks from ALL users via Firestore `collectionGroup('trucks')`
- Shows: seller avatar, name, location, trust bar, photo count badge
- Photo gallery with thumbnail strip + arrow navigation in modal
- Filters: keyword search, make, max price, sort order
- Contact Seller button dials phone directly
- Self-serve: sellers post once, stays live until marked sold

---

## API Keys in Railway

### search-api service (backend):
| Variable | Purpose |
|----------|---------|
| `SERPER_API_KEY` | `75c0f1ec7cd5b9ebc60097e609eb7d08369e6d12` — Google search results |
| `IMAGE_API_KEY` | Claude Haiku key — extracts contact info + photos from listing pages |

### Frontend service:
- No env vars needed — static files only
- Firebase config is in `js/config.js` (API key replaced with `window.__PDN_API_KEY__` for GitHub safety)

---

## File Structure
```
truck-marketplace/
├── index.html          — Main landing page
├── listings.html       — PUBLIC truck listings (NEW this session)
├── truck-search.html   — Google/Serper search page
├── dashboard.html      — User profile + truck management
├── inventory.html      — Dealer inventory
├── financing.html      — Financing page
├── login.html          — Auth page
├── server.js           — Express static server for Railway
├── package.json
├── css/main.css        — Global styles + mobile nav drawer
├── js/
│   ├── main.js         — Nav, hamburger, tab switching
│   ├── auth.js         — Firebase Auth + Firestore user ops
│   ├── config.js       — Firebase config (key removed for GitHub)
│   └── data.js         — Shared data utilities
├── assets/trucks/      — 12 photos + 1 video from user's OneDrive
└── search-api/         — Railway backend (separate repo)
    └── server.js       — Express API: /search, /search/stream, /detail
```

---

## Firestore Data Structure
```
users/{uid}
  name, email, company, phone, location, tier, createdAt
  usage: { posts_today, docs_today, date }
  trucks/{truckId}
    year, make, model, price, mileage, engine, transmission
    location, description, status (available/sold)
    condition, dotReady, financing
    photos: { exterior: [base64...], interior: [base64...] }
    createdAt
```

---

## Pending / Next Session

- [ ] **Firestore collection group index** — Firebase Console needs index on `trucks` orderBy `createdAt` for listings.html to work without error
- [ ] **Firebase config.js** — `window.__PDN_API_KEY__` placeholder means AI features (post generator, docs) won't work on live Railway site. Need to inject key safely (env var or Firebase Remote Config)
- [ ] **Fleet search toggle** — Add "Fleet Only" button that changes search queries to target fleet liquidations/auctions
- [ ] **Mobile polish** — Hero title clamp too large, search bar overflow, filter row, modal padding (full audit done, ready to implement)
- [ ] **Replace placeholder phone** — (832) 555-0180 needs real number
- [ ] **Firestore security rules** — Lock down before going live to real users
- [ ] **listings.html → add to main nav** on all pages
- [ ] **Google Firebase Auth** — Enable Google sign-in provider in Firebase Console
- [ ] **Photos stored as base64** — Large photos will hit Firestore 1MB doc limit. Should migrate to Firebase Storage URLs

---

## Known Issues
- Base64 photos in Firestore will hit size limits with many large images — migrate to Firebase Storage
- `js/config.js` API key is a placeholder on live site — AI features broken on Railway frontend
- Google sign-in not enabled in Firebase Console yet
