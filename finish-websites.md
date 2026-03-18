# VWS — Finish Both Websites Plan

*Created: March 2026 — revised with Opus review*

---

## Vision

Two comparison sites, one codebase, one database, one deployment.

| Domain | Topic | Status |
|---|---|---|
| `vaatwasstripsvergelijker.nl` | Vaatwasstrips (dishwasher strips) | Current app — domain correct, content needs fixing |
| `wasstripsvergelijker.nl` | Wasstrips (laundry strips) | Second site, to build on same infra |

**Architecture: Option B — one Next.js app, domain-aware routing.**

One CapRover deployment. Both domains point to it. Middleware detects hostname, sets a `site` context (`"wasstrips"` or `"vaatwasstrips"`). All pages, components and infrastructure are shared; product data and content are site-specific.

---

## Phase 0 — Fix current content confusion + cleanup (1 day)

The current app has an identity problem: the domain says `vaatwasstripsvergelijker.nl` (dishwasher strips) but guides and blog articles talk about "wasstrips" (laundry strips). However, **the scraper URLs confirm the product data is correct** — all 6 scraping targets point to vaatwasstrips product pages (e.g. `cosmeau.com/products/vaatwasstrips`, `mothersearth.com/products/dishwasher-sheet`). The domain is right; the content is wrong.

**Decision: keep `vaatwasstripsvergelijker.nl` as the primary site.** Fix content to say "vaatwasstrips" where it currently says "wasstrips." Build the wasstrips (laundry) site later as the second domain.

### 0.1 Fix content language

All guides and blog articles were written with "wasstrips" (laundry) language. Update to "vaatwasstrips" (dishwasher) for the current site:

- [ ] `app/gids/beginners/page.tsx` — change "wasstrips" → "vaatwasstrips", "was" → "afwas", "wasmachine" → "vaatwasser" throughout
- [ ] `app/gids/milieuvriendelijk/page.tsx` — same noun replacement
- [ ] `app/gids/kopen-tips/page.tsx` — same noun replacement
- [ ] `app/blog/[slug]/page.tsx` — all 5 articles need noun replacement (wasstrips → vaatwasstrips context)
- [ ] `app/gids/page.tsx` — hub page topic descriptions
- [ ] `app/blog/page.tsx` — blog listing excerpts and categories

### 0.2 Cleanup dead/duplicate files

The codebase has accumulated cruft that should be removed before adding multi-site complexity:

- [ ] Delete `app/home-page.tsx` (188-byte stub — real component is `app/HomePage.tsx`)
- [ ] Delete `app/api/sitemap.xml/route.ts` (old XML route — replaced by `app/sitemap.ts`)
- [ ] Delete `app/api/setup-db/route.ts` (dev helper, shouldn't be deployed)
- [ ] Delete `app/api/setup-db-schema/route.ts` (dev helper)
- [ ] Delete `app/api/push-schema/route.ts` (duplicate of `api/db-management/push-schema`)
- [ ] Audit `app/api/db-management/` — keep or gate behind auth; currently public endpoints that can push schema and seed data

### 0.3 Quick content fixes

- [ ] Fix footer year: `© 2024` → `© ${new Date().getFullYear()}`
- [ ] Fix metadata year: `"2025"` hardcoded in multiple `<Metadata>` exports → `new Date().getFullYear()`
- [ ] Hide or remove "Start Productfinder" button until Phase 5
- [ ] Verify `og-image.jpg` exists in `/public` — create a 1200×630 fallback if not
- [ ] Fix `Navigation.tsx` email: `info@vaatwasstripsvergelijker.nl` — verify this is the intended contact

---

## Phase 1 — Multi-site architecture (4–5 days)

The core technical work. Everything else builds on top of this.

### 1.1 Database: add `site` field to Product

```prisma
model Product {
  // ... existing fields ...
  site  String  @default("vaatwasstrips")  // "wasstrips" | "vaatwasstrips"

  @@index([site])
}
```

Run migration:
```bash
npx prisma migrate dev --name add_site_to_product
```

Also add `site` to models that need per-site filtering:
- `Review` — reviews belong to products which are already site-scoped via their product relation, so no extra field needed
- `PriceAlert` — same, scoped via product relation
- `BlogPost` — add `site` field (for when blog content moves to DB)
- `Guide` — add `site` field (for when guide content moves to DB)

**Note:** BlogPost and Guide models exist in the schema but are **not currently used** — all blog/guide content is static TSX. Adding the `site` field prepares for future DB migration but isn't blocking.

### 1.2 Site config: `lib/site-config.ts`

Central config object, one entry per site. Drives branding, metadata, and copy throughout the app.

```ts
export type SiteKey = 'wasstrips' | 'vaatwasstrips';

export interface SiteConfig {
  key: SiteKey;
  domain: string;
  name: string;
  tagline: string;
  description: string;
  productNoun: string;
  productNounSingular: string;
  productNounCapitalized: string;
  canonicalBase: string;
  contactEmail: string;
}

export const SITE_CONFIG: Record<SiteKey, SiteConfig> = {
  vaatwasstrips: {
    key: 'vaatwasstrips',
    domain: 'vaatwasstripsvergelijker.nl',
    name: 'Vaatwasstrips Vergelijker',
    tagline: 'De beste vaatwasstrips. Onafhankelijk vergeleken.',
    description: 'Vergelijk alle vaatwasstrips op prijs, reinigingskracht en duurzaamheid.',
    productNoun: 'vaatwasstrips',
    productNounSingular: 'vaatwasstrip',
    productNounCapitalized: 'Vaatwasstrips',
    canonicalBase: 'https://vaatwasstripsvergelijker.nl',
    contactEmail: 'info@vaatwasstripsvergelijker.nl',
  },
  wasstrips: {
    key: 'wasstrips',
    domain: 'wasstripsvergelijker.nl',
    name: 'Wasstrips Vergelijker',
    tagline: 'De beste wasstrips. Onafhankelijk vergeleken.',
    description: 'Vergelijk alle wasstrips op prijs, duurzaamheid en wasresultaat.',
    productNoun: 'wasstrips',
    productNounSingular: 'wasstrip',
    productNounCapitalized: 'Wasstrips',
    canonicalBase: 'https://wasstripsvergelijker.nl',
    contactEmail: 'info@wasstripsvergelijker.nl',
  },
};
```

### 1.3 Branding via CSS custom properties

Tailwind classes are purged at build time, so `primaryColor: 'teal'` in a config object can't drive runtime class switching. Use CSS custom properties instead.

In `app/globals.css`:
```css
:root {
  /* Default: vaatwasstrips branding */
  --color-primary: theme('colors.blue.600');
  --color-primary-light: theme('colors.blue.50');
  --color-accent: theme('colors.green.600');
  --color-gradient-from: theme('colors.blue.600');
  --color-gradient-to: theme('colors.green.600');
}

[data-site="wasstrips"] {
  --color-primary: theme('colors.teal.600');
  --color-primary-light: theme('colors.teal.50');
  --color-accent: theme('colors.cyan.600');
  --color-gradient-from: theme('colors.teal.600');
  --color-gradient-to: theme('colors.cyan.600');
}
```

In `tailwind.config.js`, extend theme:
```js
colors: {
  primary: 'var(--color-primary)',
  'primary-light': 'var(--color-primary-light)',
  accent: 'var(--color-accent)',
}
```

Set `data-site` attribute on `<html>` in `app/layout.tsx`:
```tsx
<html lang="nl" data-site={site.key}>
```

### 1.4 Middleware: `middleware.ts` (project root)

Sets both a response header (for server components) and a cookie (for client components):

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const site = host.includes('vaatwas') ? 'vaatwasstrips' : 'wasstrips';

  const response = NextResponse.next();
  // For server components (headers())
  response.headers.set('x-site', site);
  // For client components (document.cookie / cookies())
  response.cookies.set('site', site, { path: '/', sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 1.5 Server-side helper: `lib/get-site.ts`

```ts
import { headers } from 'next/headers';
import { SITE_CONFIG, SiteKey } from './site-config';

export function getSite(): SiteConfig {
  const site = (headers().get('x-site') ?? 'vaatwasstrips') as SiteKey;
  return SITE_CONFIG[site];
}
```

### 1.6 Client-side context: `components/SiteProvider.tsx`

Three key components are `'use client'`: `Navigation.tsx`, `HomePage.tsx`, `vergelijk/page.tsx`. They cannot call `getSite()` (which uses `headers()`). Solution: a React Context populated from the server layout.

```tsx
'use client';

import { createContext, useContext } from 'react';
import type { SiteConfig } from '@/lib/site-config';

const SiteContext = createContext<SiteConfig | null>(null);

export function SiteProvider({ config, children }: { config: SiteConfig; children: React.ReactNode }) {
  return <SiteContext.Provider value={config}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteConfig {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
```

In `app/layout.tsx`:
```tsx
import { getSite } from '@/lib/get-site';
import { SiteProvider } from '@/components/SiteProvider';

export default function RootLayout({ children }) {
  const site = getSite();
  return (
    <html lang="nl" data-site={site.key}>
      <body>
        <SiteProvider config={site}>
          <Navigation />
          <main>{children}</main>
          <Footer site={site} />
        </SiteProvider>
      </body>
    </html>
  );
}
```

Then in client components:
```tsx
// Navigation.tsx
const site = useSite();
// ...
<span className="text-xl font-bold">{site.productNounCapitalized}</span>
<span className="...">Vergelijker</span>
```

### 1.7 Update `lib/db-safe.ts`

All product queries need a `site` filter:

```ts
import type { SiteKey } from './site-config';

export async function getProductsSafe(site: SiteKey) {
  const cacheKey = `products_${site}`;
  const cached = getCached<...>(cacheKey);
  if (cached) return cached;

  const data = await safeDbQuery(
    () => prisma.product.findMany({
      where: { site },
      orderBy: [{ displayOrder: 'asc' }, { currentPrice: 'asc' }],
      include: { variants: { orderBy: { washCount: 'asc' } } },
    }),
    []
  );

  setCached(cacheKey, data);
  return data;
}

export async function getBrandsSafe(site: SiteKey) {
  const cacheKey = `brands_${site}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  const data = await safeDbQuery(
    async () => {
      const products = await prisma.product.findMany({
        where: { site },
        select: { supplier: true },
        distinct: ['supplier'],
        orderBy: { supplier: 'asc' },
      });
      return products.map((p) => p.supplier);
    },
    []
  );

  setCached(cacheKey, data);
  return data;
}
```

### 1.8 Update all pages to use site context

**Server component pages** — call `getSite()` and pass `site.key` to DB queries:

| Page | Change |
|---|---|
| `app/page.tsx` | `getSite()` → pass to `getProductsSafe()`, use `site.canonicalBase` in JSON-LD |
| `app/overzicht/page.tsx` | `getSite()` → pass to `getProductsSafe()` |
| `app/merken/page.tsx` | `getSite()` → pass to `getBrandsSafe()` |
| `app/merken/[slug]/page.tsx` | `getSite()` → pass to product query + JSON-LD |
| `app/prijzen/[category]/page.tsx` | `getSite()` → filter products, fix JSON-LD domain |
| `app/reviews/page.tsx` | `getSite()` → filter reviews by product site |

**Client component pages** — use `useSite()` hook:

| Page | Change |
|---|---|
| `app/vergelijk/page.tsx` | `useSite()` → add `?site=` param to `/api/products` fetch |
| `app/HomePage.tsx` | `useSite()` → use `site.productNoun` in headings and copy |
| `components/Navigation.tsx` | `useSite()` → dynamic logo text and nav labels |

**API routes** — read site from query param or `x-site` header:

| Route | Change |
|---|---|
| `app/api/products/route.ts` | Accept `?site=` query param, filter products |
| `app/api/admin/scrape/route.ts` | Pass site when invalidating cache |
| `app/api/admin/dashboard/route.ts` | Accept `?site=` filter for admin product listing |

### 1.9 Update `app/layout.tsx`

Switch from static `metadata` export to `generateMetadata`:

```ts
export async function generateMetadata() {
  const site = getSite();
  const year = new Date().getFullYear();
  return {
    metadataBase: new URL(site.canonicalBase),
    title: { default: `${site.name} Nederland ${year}`, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      title: site.name,
      description: site.description,
      images: ['/og-image.jpg'],
    },
  };
}
```

Footer becomes a server component (or receives `site` as prop) with dynamic contact email, copyright text, and year.

### 1.10 Update `app/sitemap.ts` and `app/robots.ts`

```ts
// sitemap.ts
export default async function sitemap() {
  const site = getSite();
  const base = site.canonicalBase;
  const products = await getProductsSafe(site.key);
  // ... build sitemap using base
}

// robots.ts
export default function robots() {
  const site = getSite();
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/data-beheer/', '/api/', '/_next/'] }],
    sitemap: `${site.canonicalBase}/sitemap.xml`,
  };
}
```

### 1.11 Update constants

Remove `BASE_URL` (replaced by `site.canonicalBase`). Split known slugs by site:

```ts
export const KNOWN_PRODUCT_SLUGS_VAATWASSTRIPS = [
  'mothers-earth', 'cosmeau', 'bubblyfy', 'bio-suds', 'wasstrip-nl', 'natuwash',
] as const;

export const KNOWN_PRODUCT_SLUGS_WASSTRIPS = [
  // to be added when wasstrips products are seeded
] as const;
```

### 1.12 Update scrapers

The scraping coordinator doesn't create products — it updates existing ones matched by slug. The `site` field is set when seeding products, not during scraping. No changes needed to the scraper output format.

However, the coordinator should be site-aware for the admin panel:

```ts
// scraping-coordinator.ts
interface ScrapingTarget {
  // ... existing fields ...
  site: SiteKey;
}
```

All current targets get `site: 'vaatwasstrips'`. When wasstrips brands are added later, they'll use `site: 'wasstrips'`.

### 1.13 Update admin panel (data-beheer)

- [ ] Add a site filter dropdown to the admin dashboard (show products for "vaatwasstrips" / "wasstrips" / "all")
- [ ] Add `site` field to the Edit Product modal so products can be assigned to a site
- [ ] Filter scraping targets by site when triggering scrapes
- [ ] Update product creation form to include `site` selector

---

## Phase 2 — Complete the vaatwasstrips site (3–5 days)

These are the remaining todos for the primary `vaatwasstripsvergelijker.nl` site. The high-priority 404 fixes are already done. These are the remaining hollow/incomplete pages.

### 2.1 Brand profiles — connect to DB

The `merken/[slug]/page.tsx` currently uses hardcoded mock data for brands. The Prisma `Product` model has all needed fields (`longDescription`, `pros`, `cons`, `features`, `priceHistory`).

Tasks:
- [ ] Replace mock `brandsData` object in `merken/[slug]/page.tsx` with `prisma.product.findUnique({ where: { slug, site } })`
- [ ] Replace hardcoded `priceHistory` array with `prisma.priceHistory.findMany({ where: { productId }, orderBy: { recordedAt: 'desc' }, take: 12 })`
- [ ] Seed the DB with full content for all 6 brands (see 2.2)
- [ ] Connect user reviews section to `prisma.review.findMany({ where: { productId } })`

### 2.2 Seed brand content into DB

Run a seed script or use the admin panel to populate `longDescription`, `pros`, `cons` for:

| Brand | Angle |
|---|---|
| **Mother's Earth** | Pioneer, dishwasher sheet format, eco credentials |
| **Cosmeau** | Dutch brand, university research, local production |
| **Bubblyfy** | Transparency focus, lower sustainability score — explain why honestly |
| **Bio-Suds** | EcoCert certified, premium positioning, why it costs more |
| **Natuwash** | Most affordable per wash — what's the trade-off in ingredients |
| **Wasstrip.nl** | Dutch-first brand, accessibility focus, good for beginners |

- [ ] Write `longDescription` (2–3 paragraphs) per brand — about their vaatwasstrips
- [ ] Write `pros` and `cons` arrays (5 each) per brand
- [ ] Create seed file or admin UI to push these into the DB

### 2.3 Reviews — connect to DB

The `Review` model exists in the Prisma schema. Wire it up.

- [ ] `app/reviews/page.tsx` — replace 5 hardcoded mock reviews with `prisma.review.findMany({ orderBy: { createdAt: 'desc' } })`
- [ ] Add review submission form: `name`, `email`, `rating (1-5)`, `title`, `body`, `productId`
- [ ] Create `POST /api/reviews` endpoint with Zod validation + email verification flow (reuse Subscriber token pattern)
- [ ] Add pending/verified state: reviews are only shown after `verified = true`
- [ ] Add email verification: send token → user clicks link → `PATCH /api/reviews/verify?token=`

### 2.4 Price category pages — connect to DB

`/prijzen/[category]` currently uses hardcoded mock products. Make them DB-driven:

- [ ] `goedkoopste` — query `prisma.product.findMany({ where: { site }, orderBy: { pricePerWash: 'asc' } })`, show savings vs avg
- [ ] `beste-waarde` — query ordered by `sustainability × (1/pricePerWash)` ratio (compute in app layer)
- [ ] `premium` — query `orderBy: { sustainability: 'desc' }`, top 3–4, justify premium price copy

### 2.5 Security: Origin header validation

Next.js App Router already validates `Origin` headers on Server Actions automatically. For the existing API routes, add a simple Origin check middleware:

- [ ] Create `lib/validate-origin.ts` — checks `request.headers.get('origin')` against allowed domains list
- [ ] Apply to all mutation API routes: `POST /api/reviews`, `POST /api/admin/*`, `DELETE /api/subscriber/delete`
- [ ] Allowed origins: both site domains + `localhost:3000` for dev

This is sufficient for this scale. No need for the `csrf-csrf` package.

---

## Phase 3 — SEO & performance polish (2 days)

These apply to both sites once Phase 1 is done.

### 3.1 Sitemap improvements
- [ ] Add `lastModified` to all static routes in `sitemap.ts`
- [ ] Add blog post routes dynamically (currently only product routes are dynamic)
- [ ] Add gids routes to sitemap

### 3.2 Metadata & Open Graph
- [ ] Verify OG metadata on: blog posts (done), gids pages (add), prijzen pages (add)
- [ ] Add canonical tags to price category pages — `/prijzen/goedkoopste` could be seen as duplicate content
- [ ] Verify all year strings use `new Date().getFullYear()` (should be done in Phase 0)

### 3.3 Structured data (JSON-LD)
- [ ] Add `FAQPage` schema to `gids/beginners/page.tsx` — it already has Q&A format, just needs the JSON-LD
- [ ] Add `FAQPage` schema to `gids/milieuvriendelijk/page.tsx` and `gids/kopen-tips/page.tsx`
- [ ] Add `BreadcrumbList` schema to all pages that have breadcrumbs

### 3.4 Performance
- [ ] Add `next/image` for product images when `imageUrl` is populated from scrapers
- [ ] Add pagination to `/overzicht` and `/merken` (currently loads all products — fine for 6, breaks at 50+)
- [ ] Lazy load below-fold sections on homepage (kennisbank / FAQ section)

### 3.5 Internal linking
- [ ] Add "Gerelateerde gidsen" sidebar to `gids/milieuvriendelijk` and `gids/kopen-tips` (sidebar already done on blog/[slug])
- [ ] Add "Bekijk ook" related brands section on each `merken/[slug]` page
- [ ] Add breadcrumbs to pages that are missing them: `reviews`, `uitschrijven`, `prijzen/[category]`
- [ ] Add "Populaire zoekopdrachten" footer section with links to key pages

### 3.6 UX improvements (inspired by togwaarde/flesvoedingcalculator)
- [ ] Add trust badges to homepage hero: "Onafhankelijk", "Gratis", "Actuele prijzen"
- [ ] Simplify homepage CTA — currently 4-5 competing CTAs, pick one primary action
- [ ] Add "Wat zijn vaatwasstrips?" intro paragraph above the comparison grid for first-time visitors

---

## Phase 4 — Build the wasstrips site (3–5 days)

With Phase 1 done, adding the second site is mostly content and data work, not code. The templates, components, and infrastructure are shared. This phase adds wasstrips-specific **products**, **scrapers**, and **content**.

### 4.1 Research wasstrips (laundry) brands

These same brands often sell both vaatwasstrips and wasstrips. Research which have laundry strip products:

| Brand | Notes |
|---|---|
| **Cosmeau** | Very likely has wasstrips — they're known for laundry strips too |
| **Mother's Earth** | Known laundry strip brand — verify NL product page URL |
| **Bubblyfy** | Check if they have a wasstrips product line |
| **Wasstrip.nl** | Name suggests wasstrips focus — may have both lines |
| **Natuwash** | Verify wasstrips product page |
| **Tru Earth** | Canadian brand, popular in NL, laundry strip pioneer |
| **Klean Strip** | Dutch brand if available |
| **Earth Breeze** | US brand available via Bol.com |

- [ ] Research 4–6 NL-market wasstrips brands with scrapeable product pages
- [ ] Find affiliate programs or direct links for each
- [ ] Verify scraping targets exist

### 4.2 Build wasstrips scrapers

One scraper per brand, following the `BaseScraper` pattern:

- [ ] Create `lib/scrapers/wasstrips-[brandname]-scraper.ts` for each brand
- [ ] Implement `scrapeVariants()`, `scrapeStock()`, `scrapeReviews()` per scraper
- [ ] Register scrapers in `scraping-coordinator.ts` with `site: 'wasstrips'`

### 4.3 Seed wasstrips product data

- [ ] Write seed data per brand: `slug`, `name`, `supplier`, `description`, `longDescription`, `pros`, `cons`, `features`, `site: 'wasstrips'`
- [ ] Run seed / use admin panel to populate DB
- [ ] Set `displayOrder` per product

### 4.4 Wasstrips-specific content

Blog and guide content is currently static TSX. For the second site, the pragmatic approach is to make the existing pages site-aware using `getSite().productNoun` to swap nouns, rather than duplicating all files or migrating to DB. For truly site-specific articles, add new files:

- [ ] **Blog: Wasstrips vs Traditioneel Wasmiddel** — head-to-head (laundry context, different from vaatwas version)
- [ ] **Blog: Duurzaam Wassen** — eco tips for laundry
- [ ] **Blog: Besparen op Wasmiddel** — cost per wash, bulk buying
- [ ] Write wasstrips-specific `metaTitle` / `metaDescription` variants

### 4.5 Content strategy for shared vs. site-specific pages

| Page type | Approach |
|---|---|
| Home, overzicht, merken, vergelijk, prijzen | Shared template, data from DB filtered by `site` — no duplication |
| Gids pages (beginners, milieuvriendelijk, kopen-tips) | Use `getSite().productNoun` to swap nouns. Content structure is identical for both product types |
| Blog articles | Eventually move to DB (`BlogPost` model with `site` field). Short-term: keep static, use noun swapping |
| Reviews, methodologie | Shared, site-scoped via product relation |

### 4.6 Verify multi-domain serving

- [ ] Configure both domains in CapRover (point to same app)
- [ ] Test locally with `HOST` header override: `curl -H "Host: wasstripsvergelijker.nl" http://localhost:3000`
- [ ] Verify each domain returns correct sitemap, robots.txt, metadata, products, and branding
- [ ] Verify admin panel works on both domains (or gate to one domain only)

---

## Phase 5 — Productfinder tool (2–3 days)

Applies to both sites once Phase 1 is done. The tool is site-aware: questions use `site.productNounSingular`, algorithm filters the site's products.

### Architecture
- Route: `app/productfinder/page.tsx` (client component, multi-step quiz)
- No DB writes needed — purely client-side computation
- Products fetched via `GET /api/products?site={siteKey}` from the server

### Quiz structure (5 questions)
1. **Huishoudgrootte** — 1 persoon / 2 personen / gezin (3-4) / groot gezin (5+)
2. **Watertype** — Zacht (Groningen) / Gemiddeld / Hard (Utrecht, Zeeland)
3. **Duurzaamheid** — Niet belangrijk / Beetje / Heel belangrijk
4. **Budget** — Budget (< €0,20/was) / Midden / Premium (beste kwaliteit)
5. **Geur** — Geen geur / Lichte geur / Sterke geur

### Algorithm
Score each product 0–100 based on weighted answers. Return top 3 with explanation.

```ts
function scoreProduct(product, answers): number {
  let score = 0;
  if (answers.budget === 'budget' && product.pricePerWash < 0.22) score += 30;
  if (answers.sustainability === 'high' && product.sustainability > 7) score += 30;
  // etc.
  return score;
}
```

### Tasks
- [ ] Design quiz UI (step-by-step, progress bar, back button)
- [ ] Implement scoring algorithm
- [ ] Result page: top 3 cards with "Waarom dit merk past bij jou" explanation
- [ ] CTA on each result: link to `merken/[slug]` + affiliate link
- [ ] Remove/unhide "Start Productfinder" button on homepage after this is live
- [ ] Add `app/productfinder/page.tsx` to sitemap

---

## Phase 6 — Knowledge base expansion (ongoing)

Low-priority SEO content. Add articles as time allows. These all follow the existing guide pattern.

### Vaatwasstrips kennisbank (vaatwasstripsvergelijker.nl — primary site)

**Milieuvriendelijk categorie:**
- [ ] Vaatwasstrips vs tabs vs pods: milieu-vergelijking
- [ ] Plasticvrij afwassen: complete gids
- [ ] Ingrediënten in vaatwasstrips: wat betekent het?
- [ ] Certificeringen: wat betekent EcoCert, OECD 301B?

**Kopen tips categorie:**
- [ ] Hoe kies je de juiste vaatwasstrip voor jouw vaatwasser?
- [ ] Strips voor vaatwassers met en zonder zout
- [ ] Dosering bij hard water
- [ ] Prijsalerts instellen: nooit meer teveel betalen

**Troubleshooting categorie (new):**
- [ ] Vaatwasstrip lost niet op — wat nu?
- [ ] Witte aanslag op glazen na gebruik strips
- [ ] Strips werken niet goed bij vol gevulde machine
- [ ] Troebel bestek na gebruik strips

### Wasstrips kennisbank (wasstripsvergelijker.nl — second site)

**Milieuvriendelijk categorie:**
- [ ] Welke wasstrips zijn het meest duurzaam? (+ sustainability score methodology)
- [ ] Verpakking en plasticvrij wassen
- [ ] Biologisch afbreekbare ingrediënten uitgelegd

**Kopen tips categorie:**
- [ ] Strips voor hard vs zacht water
- [ ] Groot vs klein pakket: wanneer loont bulkinkoop?
- [ ] Prijsalerts instellen: nooit meer teveel betalen

**Troubleshooting categorie:**
- [ ] Wasstrip lost niet op — wat nu?
- [ ] Witte vlekken op donkere kleding na wasstrips
- [ ] Strips werken niet goed bij lage temperaturen
- [ ] Allergische reactie op wasstrips: wat te doen?

---

## Phase 7 — Monitoring & testing (ongoing)

### Error tracking
- [ ] Add Sentry (`npm install @sentry/nextjs`)
- [ ] Configure `sentry.client.config.ts` and `sentry.server.config.ts`
- [ ] Add `SENTRY_DSN` env var in CapRover
- [ ] Set up Sentry alerts for new errors

### DB backups
- [ ] Configure PostgreSQL backup schedule in CapRover dashboard
- [ ] Test restore procedure at least once

### Testing
- [ ] Add API route tests for login, GET products, POST scrape (needs MSW mocks)
- [ ] Add Playwright E2E test: admin login → trigger scrape → verify products update
- [ ] Add site-context unit tests: `getSite()` returns correct config per hostname
- [ ] Test middleware returns correct `x-site` header for each domain

---

## Remaining TODO summary

### From TODO.md (technical debt)
| Item | Priority | Phase |
|---|---|---|
| Origin header validation on mutation routes | 🔴 High | Phase 2.5 |
| Verify OG metadata on all pages | 🟠 Medium | Phase 3.2 |
| `next/image` for product images | 🟠 Medium | Phase 3.4 |
| Pagination on product listings | 🟠 Medium | Phase 3.4 |
| API route tests | 🟡 Low | Phase 7 |
| Playwright E2E test | 🟡 Low | Phase 7 |
| Sentry error tracking | 🟡 Low | Phase 7 |
| DB backup automation | 🟡 Low | Phase 7 |

### From content-audit.md (content debt — vaatwasstrips site)
| Item | Priority | Phase |
|---|---|---|
| Fix content language (wasstrips → vaatwasstrips) | 🔴 High | Phase 0.1 |
| Cleanup dead files | 🔴 High | Phase 0.2 |
| Fix footer date (dynamic year) | 🔴 High | Phase 0.3 |
| Hide productfinder button | 🔴 High | Phase 0.3 |
| Verify OG image exists in /public | 🔴 High | Phase 0.3 |
| Connect brand pages to DB | 🟠 Medium | Phase 2.1 |
| Seed brand content (6 brands) | 🟠 Medium | Phase 2.2 |
| Reviews DB connection + form | 🟠 Medium | Phase 2.3 |
| Price category pages DB-driven | 🟠 Medium | Phase 2.4 |
| Sitemap: add blog + gids routes | 🟡 Low | Phase 3.1 |
| Canonical tags on category pages | 🟡 Low | Phase 3.2 |
| FAQ schema (JSON-LD) on gids pages | 🟡 Low | Phase 3.3 |
| BreadcrumbList schema on all pages | 🟡 Low | Phase 3.3 |
| Trust badges on homepage | 🟡 Low | Phase 3.6 |
| Simplify homepage CTA hierarchy | 🟡 Low | Phase 3.6 |
| "Wat zijn vaatwasstrips?" intro on home | 🟡 Low | Phase 3.6 |
| 8+ kennisbank articles (vaatwasstrips) | 🟡 Low | Phase 6 |

---

## Effort estimate

| Phase | Description | Estimate |
|---|---|---|
| 0 | Fix content confusion + cleanup | 1 day |
| 1 | Multi-site architecture | 4–5 days |
| 2 | Complete vaatwasstrips site | 3–5 days |
| 3 | SEO & performance polish | 2 days |
| 4 | Build wasstrips site | 3–5 days |
| 5 | Productfinder tool | 2–3 days |
| 6 | Knowledge base expansion | Ongoing |
| 7 | Monitoring & testing | 1–2 days |
| **Total** | | **~19–26 days** |

---

## Quick wins (do these first, <1 day total)

1. Fix footer year: `© 2024` → dynamic `new Date().getFullYear()`
2. Fix metadata year: `"2025"` → `new Date().getFullYear()` in all page metadata
3. Hide productfinder button (1 line of code)
4. Delete `app/home-page.tsx` stub
5. Delete `app/api/sitemap.xml/route.ts` (superseded by `app/sitemap.ts`)
6. Verify `/public/og-image.jpg` exists — create 1200×630 placeholder if not
7. Add FAQ JSON-LD to `gids/beginners/page.tsx`
