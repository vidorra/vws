# VWS — Content & SEO Audit + TODO

Based on full content analysis (March 2026). Compared with togwaarde and flesvoedingcalculator for inspiration.
Overall content completeness: **~65%**

---

## Current page status

| Page | Content | DB-driven |
|---|---|---|
| `/` Home + comparison grid | ✅ Complete | Yes |
| `/overzicht` | ✅ Complete | Yes |
| `/vergelijk` Comparison tool | ✅ Complete | Yes |
| `/methodologie` | ✅ Complete | Static |
| `/gids/beginners` | ✅ Complete | Static |
| `/merken` Brand list | ✅ Complete | Yes |
| `/prijzen` Price category hub | ✅ Complete | Static |
| `/blog` | ⚠️ Skeleton — 5 mock posts, no article pages | No |
| `/merken/[slug]` | ⚠️ Template for 1 brand only (Mother's Earth) | No |
| `/reviews` | ⚠️ 5 hardcoded mock reviews, no form | No |
| `/gids` hub | ⚠️ Links to 2 guides that don't exist | No |
| `/gids/milieuvriendelijk` | ❌ 404 — linked from gids hub | — |
| `/gids/kopen-tips` | ❌ 404 — linked from gids hub | — |
| `/prijzen/[category]` | ❌ 404 — linked everywhere | — |
| `/blog/[slug]` | ❌ Missing — no individual article pages | — |
| Productfinder tool | ❌ Button exists, no route | — |

---

## 🔴 High Priority — Fix broken routes and missing pages

These are currently linked from navigation or other pages and return 404.

### Broken routes
- [x] Create `/app/gids/milieuvriendelijk/page.tsx` — linked from gids hub ✅
- [x] Create `/app/gids/kopen-tips/page.tsx` — linked from gids hub ✅
- [x] Create `/app/prijzen/[category]/page.tsx` — already existed ✅
- [x] Create `/app/blog/[slug]/page.tsx` — 5 blog posts link to individual pages ✅

### Blog articles to write (5 existing mock posts)
Content structure per article: intro, 3-4 sections, comparison table or tip list, CTA, internal links.
- [x] **Wasstrips vs Traditioneel Wasmiddel** — head-to-head effectiveness, cost/year, eco impact ✅
- [x] **Duurzaam Wassen: 10 Tips** — certifications, ingredients, packaging, carbon footprint ✅
- [x] **Besparen op Wasmiddel: 7 Strategieën** — bulk buying, price alerts, best value picks ✅
- [x] **De Geschiedenis van Wasstrips** — innovation history ✅
- [x] **Vlekken Verwijderen met Wasstrips** — stain removal guide per stain type ✅

### Content fixes
- [ ] Fix inconsistent dates — footer says "December 2024", code says "June 2025". Pick one and make it dynamic
- [ ] Remove or hide "Start Productfinder" button until tool is built — currently leads nowhere

---

## 🟠 Medium Priority — Fill in hollow pages

### Brand profiles (5 brands need full content)
Template exists for Mother's Earth. Apply to all brands.

Each brand page needs:
- Long description (2-3 paragraphs, unique per brand)
- Pros/cons list (5 each)
- Feature table (temperature range, wash count, certifications, scent)
- Price history chart (DB-driven via PriceHistory model)
- User reviews section (DB-driven)
- "Vergelijk met" links to other brands

Brands to write:
- [ ] **Cosmeau** — Dutch brand, university research angle, local production
- [ ] **Bubblyfy** — Transparency angle, low sustainability score — explain why
- [ ] **Bio-Suds** — EcoCert certified, premium positioning
- [ ] **Natuwash** — Angle: most affordable per wash, what's the trade-off?
- [ ] **Wasstrip.nl** — Dutch-first brand, accessibility focus

### Reviews
- [ ] Connect reviews page to DB (Reviews model already exists in Prisma schema)
- [ ] Add review submission form with name, rating (1-5), title, body, email
- [ ] Add email verification step (token already in Subscriber model — repurpose pattern)
- [ ] Replace 5 hardcoded mock reviews with DB query

### Price category pages `/prijzen/[category]`
- [ ] `goedkoopste` — filter products by lowest pricePerWash, show savings vs avg
- [ ] `beste-waarde` — filter by sustainability × price ratio
- [ ] `premium` — top sustainability score products, justify premium price

---

## 🟡 Low Priority — Growth and SEO authority

### Gids knowledge base (expand from 1 guide to 10-15)
Inspired by flesvoedingcalculator's 60+ article kennisbank. Suggested articles:

**Milieuvriendelijk category** (fix the broken hub link):
- [ ] Welke vaatwasstrips zijn het meest duurzaam? (+ sustainability score methodology)
- [ ] Verpakking en plasticvrij afwassen
- [ ] Biologisch afbreekbare ingrediënten uitgelegd
- [ ] Certificeringen: wat betekent EcoCert, OECD 301B?

**Kopen tips category** (fix the broken hub link):
- [ ] Hoe kies je de juiste vaatwasstrip voor jouw situatie?
- [ ] Strips voor harde vs zachte wateren
- [ ] Groot vs klein pakket: wanneer loont bulkinkoop?
- [ ] Prijsalerts instellen: nooit meer teveel betalen

**Troubleshooting category** (new):
- [ ] Vaatwasstrip lost niet op — wat nu?
- [ ] Witte aanslag op glazen na gebruik strips
- [ ] Strips werken niet goed bij lage temperaturen
- [ ] Allergie voor vaatwasstrips: wat te doen?

### Productfinder tool
- [ ] 5-question quiz: household size, hardness of water, sustainability priority, budget, scent preference
- [ ] Algorithm: weight answers against product scores
- [ ] Result: top 3 recommendations with "Why this matches you" explanation
- [ ] CTA: link to product page + affiliate URL

### Internal linking strategy
Inspired by flesvoedingcalculator's sidebar approach:
- [ ] Add "Gerelateerde gidsen" sidebar to all gids articles
- [ ] Add "Bekijk ook" related brands section on each merken page
- [ ] Add "Lees ook" links at end of every blog article
- [ ] Add breadcrumbs to all non-home pages (some pages have them, not all)

### SEO improvements
- [ ] Add `lastModified` to all static pages in `sitemap.ts`
- [ ] Verify Open Graph images — `og-image.jpg` referenced but file may not exist in `/public`
- [ ] Add canonical tags to category pages (prijzen/goedkoopste could duplicate content)
- [ ] Update year in metadata titles — "2025" is hardcoded, will age badly; make dynamic
- [ ] Add FAQ schema (JSON-LD) to gids pages — the beginners guide has Q&A format already

---

## UX improvements from inspiration projects

### From togwaarde
- [ ] Add trust badges to homepage hero — "Onafhankelijk", "Gratis", "Actuele prijzen"
- [ ] Simplify homepage CTA hierarchy — currently 4-5 competing CTAs; reduce to 1 primary
- [ ] Add brief "Wat zijn vaatwasstrips?" explanation above the comparison grid for first-time visitors

### From flesvoedingcalculator
- [ ] Add sidebar with related content to gids and blog pages
- [ ] Implement lazy loading for below-fold sections on homepage (kennisbank/FAQ sections)
- [ ] Add "Populaire zoekopdrachten" footer links to guide internal linking

---

## Done ✅

### High priority broken routes (March 2026)
- `/app/gids/milieuvriendelijk/page.tsx` — full guide with 7 sections, CO2 table, certifications, CTA
- `/app/gids/kopen-tips/page.tsx` — full guide with 7 sections, bulk tips, checklist, CTA
- `/app/blog/[slug]/page.tsx` — dynamic route serving 5 full blog articles with sidebar + internal links
- `/app/prijzen/[category]/page.tsx` — already existed
