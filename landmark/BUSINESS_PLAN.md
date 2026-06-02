# Paso Del Norte — Business Plan & SaaS Strategy
## Last Updated: 2026-05-28

---

## Business Model

**Owner:** Buys fleets of trucks (5–20 units), refurbishes/polishes them, resells at margin.

**Platform:** The website serves two purposes simultaneously:
1. **Personal tool** — list and sell your own flipped fleet fast
2. **SaaS product** — charge other private sellers and companies to use the same platform

You are your own first customer — every problem you find before launch is a problem your users never hit.

---

## Target Users

- Independent owner-operators flipping 1–2 trucks/year
- Small fleet companies (5–50 trucks)
- Dealerships and brokers

---

## Pricing Structure

### Free — $0/month
**The freemium hook — primary marketing funnel**
- Post Generator (3 posts/day, limited)
- Browse listings (read-only)
- No account required

**Why free:** Users searching "free truck listing generator" or "semi truck for sale post template" land on your site via Google. They use the tool, see the platform, want more → upgrade. Zero ad spend needed.

### Pro — $39/month or $390/year (2 months free)
- Unlimited post generation
- Unlimited truck listings
- Document exports (unlimited)
- TX Truck Search access
- Save/draft listings (localStorage + Firestore)

### Business — $99/month or $990/year (2 months free)
- Everything in Pro
- Facebook Marketplace auto-posting (biggest feature — posts live without user doing anything)
- Profit/cost tracker per unit (buy price → repair cost → sale price → net margin)
- Multiple team members / users per account
- Priority listing placement in search results
- Live agent support

---

## Why This Pricing Works

| Model | Verdict |
|-------|---------|
| Per truck | Bad — unpredictable, users list once and leave |
| Monthly | Good for launch — low commitment, easy to test |
| Yearly | Best long term — lock-in, upfront cash, 2 months free incentive |

**Launch with monthly + yearly options on both tiers.** Add a third tier later once you know what users actually want.

---

## Tech Stack

### Layer 1 — Auth
**Firebase Authentication** (email/password)
- Signup, login, password reset, session tokens
- Free tier covers launch volume

### Layer 2 — Database
**Firestore**
```
users/
  {uid}/
    name, email, company, tier (free|pro|business)
    usage/
      docs_today: 0
      posts_today: 0
      date: "2026-05-28"
    saved_trucks: [id1, id2]
    fleet/
      {truckId}/
        buy_price, repair_cost, sell_price, days_on_lot, status
```

### Layer 3 — Payments
**Stripe**
- Create 2 Products in Stripe dashboard (Pro + Business), each with monthly + yearly prices
- Firebase Extension "Run Payments with Stripe" — connects Firebase Auth + Stripe with no custom server
- Stripe webhook → Firestore updates user tier automatically on pay/cancel/upgrade

### Layer 4 — Hosting
**Railway** (already in use) — keep it, no migration needed

---

## Feature Gates

Every page checks user tier before allowing actions:

```javascript
// pseudocode
const tier = await getUserTier(uid); // reads Firestore
if (tier === 'free' && postsToday >= 3) showUpgradeModal();
if (tier === 'pro' || tier === 'business') unlockFullGenerator();
if (tier === 'business') unlockFBAutoPost();
```

---

## Build Order (Next Sessions)

### Phase 1 — Auth Foundation
1. Firebase Console — enable Auth (Email/Password) + Firestore
2. Paste real Firebase config into `js/data.js` (replace stubs)
3. Build `login.html` — user wants to design UI before building
4. Build `profile.html` — name, company, DOT#, location, current tier

### Phase 2 — Payments
5. Stripe account setup — create Pro + Business products
6. Install Firebase "Run Payments with Stripe" extension
7. Build tier selection / upgrade UI
8. Feature gate: docs, post-gen, TX search

### Phase 3 — Core SaaS Features
9. Post Generator daily limits per tier
10. FB Marketplace auto-posting (Business tier) — research FB API
11. `localStorage` persistence — forms don't lose data on navigation
12. Fleet profit tracker in Admin panel (buy/repair/sell/margin per truck)
13. Buyer inquiry capture → Firestore leads

### Phase 4 — Growth
14. SEO — landing pages for "free truck listing generator", "semi truck for sale Texas"
15. Google Analytics / Firebase Analytics
16. Email drip on free signups → upsell to Pro

---

## Post Generator Strategy

**Free tier** — 3 posts/day, no FB posting, manual copy-paste
**Pro** — unlimited generation, manual copy-paste
**Business** — unlimited + "Send Live" button auto-posts to FB Marketplace without user touching anything

This is the single strongest feature to sell Business tier. A dealer with 10 trucks to move saves 2+ hours per batch just on this one feature.

---

## Freemium Funnel

```
Google search → Free post generator
      ↓
User creates 3 posts, hits daily cap
      ↓
Upgrade modal: "Unlock unlimited + FB auto-posting"
      ↓
Pro or Business signup → Stripe
      ↓
Firestore tier updates → features unlock immediately
```

---

## Notes
- Admin PIN: 1025
- Phone placeholder to replace: (832) 555-0180
- Firebase account exists — Firestore not yet enabled
- Signature pad (canvas draw) pending for docs.html
- Login/profile page UI — user designs first, then build
