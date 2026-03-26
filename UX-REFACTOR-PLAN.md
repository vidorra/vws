# VWS UX Refactor Plan

## Problem
Site looks cluttered with bad UX — too many sections, inconsistent styling, navigation overload, duplicate pages.

## Phase 1: Navigation (Navigation.tsx) ✅
- [x] Reduce from 9 to 5 items: Vergelijken, Merken, Gids (dropdown), Blog, Productfinder (CTA button)
- [x] Remove: Home link (logo handles it), Prijzen dropdown, Overzicht link, Reviews link, Methodologie link
- [x] Replace hardcoded `bg-blue-600` / `hover:text-blue-600` with `btn-primary` / `hover:text-primary`
- [x] Update mobile menu to match

## Phase 2: globals.css + Tailwind ✅
- [x] Add `.card` utility class: `bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200`
- [x] All brand color utilities in place

## Phase 3: Home Page (HomePage.tsx) ✅
- [x] Remove `console.log`
- [x] Fix hero: replace inline styles with Tailwind, reduce height, merge trust badges into hero
- [x] Remove productfinder CTA banner (nav already has button)
- [x] Remove "Wat zijn wasstrips?" intro (belongs on /gids/beginners)
- [x] Remove ComparisonTable (was duplicating overzicht content)
- [x] Simplify FAQ: accordion style, no "Q:"/"A:" prefixes, `.card` pattern, 4 items
- [x] Simplify CTA section to single line + button
- [x] Collapse Disclaimer into expandable single line
- [x] Remove SEO Footer "Gerelateerde Zoektermen" keyword block
- [x] Replace all gradient cards with `.card` pattern
- [x] Replace hardcoded blue colors with brand variables

## Phase 4: Overzicht → Redirect ✅
- [x] Add permanent 301 redirect `/overzicht` → `/#vergelijking` in next.config.js

## Phase 5: Secondary Pages ✅
- [x] **merken/page.tsx**: Breadcrumb, `max-w-7xl` container, glassmorphism cards with arrows, subtitle
- [x] **reviews/page.tsx**: `.card` pattern, Lucide Check/X icons, consistent brand colors
- [x] **layout.tsx**: Footer links use `hover:text-primary`

## Design Standard
All cards: `card` class (= `bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200`)
All headings: `text-primary`
All buttons: `btn-primary`
All hover links: `hover:text-primary`
All light backgrounds: `bg-brand-light`
No hardcoded blue/green gradients.
