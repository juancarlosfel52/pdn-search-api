# CLAUDE SUMMARY — Paso Del Norte: Truck & Equipment Sales
## Read this at the start of every session.

---

**Last Updated:** 2026-06-01 (Session S03)

## Live URLs
| Service | URL |
|---------|-----|
| Frontend | `https://pdn-search-api-production-4ce5.up.railway.app` |
| Search API | `https://pdn-search-api-production.up.railway.app` |

## GitHub Repos
| Repo | Purpose |
|------|---------|
| `github.com/juancarlosfel52/pdn-search-api` | Frontend (truck-marketplace folder) |
| `github.com/juancarlosfel52/-pdn-search-api` | Backend (search-api folder) |

## Railway Environment Variables
**Backend (search-api):**
- `SERPER_API_KEY` — Serper.dev (Google search results)
- `IMAGE_API_KEY` — Claude Haiku (contact/image extraction from listing pages)

## Key Pages
| Page | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `listings.html` | PUBLIC — all user-posted trucks (NEW S03) |
| `truck-search.html` | Live Google/Serper search with SSE streaming |
| `dashboard.html` | User profile, truck management, photo upload (8 exterior + 8 interior) |
| `inventory.html` | Dealer inventory |
| `financing.html` | Financing |
| `login.html` | Firebase Auth |

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS, Firebase Auth + Firestore
- **Backend:** Node.js + Express, Serper.dev, Claude Haiku (`IMAGE_API_KEY`)
- **Auth:** Firebase email/password (Google sign-in NOT yet enabled)
- **DB:** Firestore — `users/{uid}/trucks/{truckId}`
- **Photos:** Stored as base64 in Firestore ⚠ should migrate to Firebase Storage
- **Search:** Serper.dev → `/search/stream` SSE → cards stream in live

## Admin
- **Admin PIN:** 1025
- **Phone:** (832) 555-0180 (placeholder — needs real number)

## Mobile Nav
- 3-tab side panel: Browse / Services / Account
- Updated in ALL 9 HTML pages + `css/main.css` + `js/main.js`

## Firestore Structure
```
users/{uid}
  name, email, company, phone, location, tier
  trucks/{truckId}
    year, make, model, price, mileage, engine, transmission
    location, description, status (available/sold)
    photos: { exterior: [base64...], interior: [base64...] }
    createdAt
```

## Pending for Next Session
1. **Firestore index** — Create collection group index for `trucks` orderBy `createdAt` in Firebase Console (needed for listings.html)
2. **Config.js API key** — `window.__PDN_API_KEY__` placeholder breaks AI features on live site
3. **Fleet search toggle** — "Fleet Only" button on truck-search.html
4. **Mobile polish** — Full audit done in S03, ready to implement
5. **Firebase Storage** — Migrate photos from base64 → Storage URLs (Firestore 1MB doc limit)
6. **Firestore security rules** — Lock down before going public
7. **Google sign-in** — Enable in Firebase Console
8. **Nav update** — Add listings.html link to main nav on all pages

## Session Notes Index
- S01: `SESSION_NOTES_2026-05-28_S01.md` — Initial build
- S02: `SESSION_NOTES_2026-05-28_S02.md` — Auth, dashboard, trust bar, seller profile
- S03: `SESSION_NOTES_2026-06-01_S03.md` — Railway deploy, Serper search, listings page, photo upload, mobile nav 3-tab
