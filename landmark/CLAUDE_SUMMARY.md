# CLAUDE SUMMARY — Paso Del Norte: Truck & Equipment Sales
## Read this at the start of every session.

---

## What This Project Is
A premium semi-truck marketplace website for **Paso Del Norte: Truck & Equipment Sales**.
Built for owner-operators, fleet buyers, oilfield workers, and diesel enthusiasts.
Vanilla HTML/CSS/JS — no frameworks. GSAP for animations. Firebase backend (stub).

**Root:** `C:\Users\juanc\Desktop\truck-marketplace\`
**Local:** `http://localhost:3000` (run Node server from project root)
**Deploy:** Railway (static)

---

## Design Rules — NEVER BREAK THESE
- Dark matte black UI (`#060608` base)
- Amber LED accents (`#f59e0b`) — primary color for highlights, CTAs, borders
- Chrome/silver text (`#f4f4f5`) for headings
- Fonts: **Barlow Condensed** (display), **Barlow** (body), **JetBrains Mono** (specs)
- NO rustic, vintage, western, or farm aesthetics
- Cinematic, premium, modern, industrial

---

## File Map
```
truck-marketplace/
├── index.html          Homepage (hero, featured, search, financing, contact)
├── inventory.html      Full inventory with filters
├── detail.html         Truck detail page
├── financing.html      Financing app + calculator + trade-in
├── admin.html          Admin dashboard (PIN: 1025)
├── docs.html           Driver document center (10 trucker + 6 TX legal docs)
├── css/
│   └── main.css        Full design system
├── js/
│   ├── data.js         Truck data, filter, financing calc, export
│   ├── main.js         GSAP, nav, canvas background, toast
│   └── inventory.js    Search/filter/sort/render
└── landmark/
    ├── CLAUDE_SUMMARY.md       ← YOU ARE HERE
    └── SESSION_NOTES_2026-05-28_S01.md
```

---

## Key Functions (js/data.js)
- `TRUCKS[]` — all truck listings
- `filterTrucks(filters)` — filter by make/cab/condition/price/mileage etc.
- `getTruck(id)` — get single truck by ID
- `calcPayment({price, downPercent, rateAPR, termMonths})` — financing estimator
- `formatPrice(n)` — "$189,500"
- `formatMileage(n)` — "312,000 mi"
- `generateListing(truck, platform)` — export to Facebook/Craigslist/etc.
- `submitLead(data)` — stub, wire to Firebase
- `Saved` — localStorage save/toggle/check

---

## Admin
- URL: `/admin.html`
- PIN: `1025`
- Panels: Dashboard | Inventory | Leads | Export Listings | AI Descriptions

---

## Document Center (docs.html)
### How it works
- Click doc in sidebar → renders in white paper card
- Toolbar: New / Save (localStorage) / Load / Export JSON / Print-PDF
- All fields are editable inputs
- Print hides nav/toolbar — clean white doc output

### Texas Legal Docs
All reference real Texas law (TX Transportation Code, Business & Commerce Code, TxDMV, TxDOT, FMCSA).
Include legal disclaimer — not a substitute for attorney.

---

## What Needs To Be Done Next
1. Firebase credentials → replace stub in `js/data.js`
2. Real truck photos → replace Unsplash URLs with Cloudinary
3. Real phone number → replace `(832) 555-0180`
4. Signature pad → canvas draw on doc forms
5. Claude API → wire AI description generator in admin
6. Railway deploy → push static files
7. Real truck listings → add to TRUCKS array

---

## Cost Control Rules (always apply)
- Read max 200–400 lines at a time on large files
- Ask for function name / tag before reading
- Keep responses under 150 lines
- No full-file reads unless absolutely necessary
