# VWS — Vaatwasstrips Vergelijker — TODO

Based on full audit (March 2026). Compared against more mature projects: valueedge & flesvoedingcalculator.

---

## 🔴 High Priority

### Security
- [x] **Remove hardcoded `"admin123"` fallback** in `lib/auth.ts` — throws error if env vars missing
- [x] **Add rate limiting** on `/data-beheer/login` — 5 attempts per 15 min, in-memory
- [x] **Add Zod input validation** to login API route
- [ ] **Add CSRF protection** — POST endpoints are currently vulnerable to cross-site attacks
- [x] **Verify `.env` is in `.gitignore`** — confirmed ✅

### Performance
- [x] **Parallelize scraping** — replaced sequential for-loop with `Promise.allSettled()`. ~18s → ~5s
- [x] **Remove `force-dynamic` from pages** — switched to `revalidate = 300` on home, overzicht, prijzen, merken

### GDPR
- [x] **Add cookie consent banner** — `components/CookieConsent.tsx`, added to root layout
- [x] **Add privacy policy page** — `app/privacybeleid/page.tsx`, linked in footer

---

## 🟠 Medium Priority

### SEO
- [x] **Add `app/sitemap.ts`** — Next.js native, pulls live product slugs from DB with fallback
- [x] **Add `app/robots.ts`** — Next.js native, blocks admin/api, correct domain
- [x] **Add JSON-LD structured data** — `WebSite` + `ItemList` on home; `Product` on brand pages (domain fixed)
- [ ] **Verify Open Graph metadata** on all pages (home ✅, brand pages ✅, need to check: blog, gids, prijzen)

### Performance
- [ ] **Add `next/image`** for product images/logos — no real image URLs in use yet; ready when `imageUrl` is populated
- [x] **Cache product data** — 5-min in-memory TTL cache in `lib/db-safe.ts`; invalidated on scrape
- [ ] **Add pagination or infinite scroll** to product listings — currently loads all products at once

### Code Quality
- [x] **Add Prettier** — `.prettierrc` + `prettier-plugin-tailwindcss`; run `npm install && npm run format`
- [x] **Add ESLint config** — `.eslintrc.json` with `no-console`, `no-unused-vars`, `no-explicit-any` rules
- [x] **Add pre-commit hooks** — `.husky/pre-commit` + `lint-staged` config; run `npm install` to activate

---

## 🟡 Low Priority

### Testing
- [x] **Set up Vitest** — `vitest.config.ts` + tests for `lib/auth.ts` (5 tests) and `lib/db-safe.ts` (8 tests); run `npm install && npm test`
- [ ] **Add API route tests** — login, GET products, POST scrape (needs test DB or MSW mocks)
- [ ] **Add Playwright E2E test** — admin login → scrape → view products flow

### GDPR & Legal
- [x] **Add data deletion endpoint** — `DELETE /api/subscriber/delete` with Zod validation + transaction
- [x] **Add email unsubscribe flow** — `GET /api/subscriber/unsubscribe?token=` redirects to `/uitschrijven` page

### Monitoring & DevOps
- [x] **Add structured logging** — `lib/logger.ts` outputs JSON; used in db-safe, login route
- [ ] **Add error tracking** — Sentry integration (needs `npm install @sentry/nextjs` + DSN env var)
- [ ] **Add DB backup automation** — configure CapRover PostgreSQL backup schedule in dashboard
- [x] **Add health check to CI** — GH Actions now runs lint + tests + waits 30s then hits `/api/health` post-deploy

### Developer Experience
- [x] **Add JSDoc comments** — added to `auth.ts`, `db-safe.ts`, `base-scraper.ts`
- [x] **Replace magic numbers** — `lib/constants.ts` centralises all magic values; wired into auth, login, cache, sitemap
- [ ] **Add Storybook** — skip (optional, component library too small to justify)

---

## Done ✅
- Restored 157 source files from `.history/` (project was missing all source)
- Fixed hardcoded `admin123` password (`lib/auth.ts`)
- Added rate limiting (5 req/15 min) + Zod validation to login route
- Parallelized scraping with `Promise.allSettled()` — scrape time from ~18s to ~5s
- Switched home/overzicht/prijzen/merken from `force-dynamic` to `revalidate = 300`
- Added `CookieConsent` banner (GDPR-compliant, persists in localStorage)
- Added `/privacybeleid` page with full AVG-compliant content
- Linked privacy policy in footer
- Verified `.env` is in `.gitignore`
- Added `app/sitemap.ts` (Next.js native, pulls live DB slugs)
- Added `app/robots.ts` (Next.js native)
- Added JSON-LD `WebSite` + `ItemList` schemas on home page
- Fixed Product JSON-LD domain on brand pages (wasstripsvergelijker → vaatwasstripsvergelijker)
- Added 5-min in-memory TTL cache in `lib/db-safe.ts`; auto-invalidates on scrape
- Added `.prettierrc`, `.eslintrc.json`, `.husky/pre-commit`, `lint-staged` — run `npm install` to activate
- Added Vitest with tests for auth.ts (5 cases) and db-safe.ts (8 cases)
- Added `DELETE /api/subscriber/delete` for GDPR data erasure
- Added `GET /api/subscriber/unsubscribe?token=` + `/uitschrijven` confirmation page
- Added `lib/logger.ts` structured JSON logger; replaces console.error in key files
- Added health check step to GitHub Actions deploy workflow
- Added JSDoc to `auth.ts`, `db-safe.ts`, `base-scraper.ts`
- Added `lib/constants.ts` — all magic numbers in one place
