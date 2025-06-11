# Guide: Additional Brands for Vaatwasstrips Vergelijker

## Executive Summary
Expand from 5 to 7 brands to achieve complete Dutch market coverage. Add **Natuwash** (premium certified) and **GreenGoods** (trial-friendly) to fill gaps in sustainability certification and marketplace availability.

---

## Recommended Brands to Add

### 1. **Natuwash** (Priority: HIGH)
**Why add:** Only brand with OECD 301B certification, fills premium sustainability gap

#### Product Information Needed:
- **Name**: Natuwash Vaatwasstrips
- **Supplier**: NATUWASH
- **URL**: https://natuwash.com/products/vaatwasstrips
- **Current Price**: €TBD (requires research/scraping)
- **Price Per Wash**: €TBD (calculate based on pack size)
- **Washes Per Pack**: TBD (likely 60)
- **Description**: OECD 301B certified biodegradable dishwasher strips
- **Long Description**: Dutch company combining technology and nature for sustainable washing solutions

#### Features to Include:
```
features: [
  "OECD 301B Gecertificeerd",
  "Hypoallergeen",
  "Plastic-vrije verpakking",
  "Fosfaatvrij",
  "30 dagen geld-terug-garantie"
]
```

#### Pros/Cons:
```
pros: [
  "Enige merk met OECD 301B certificering",
  "Hypoallergene varianten beschikbaar",
  "Nederlandse bedrijfsvoering",
  "30 dagen proefperiode"
]

cons: [
  "Beperkte online aanwezigheid",
  "Onduidelijke prijsstelling",
  "Kleinere bekendheid"
]
```

#### Sustainability Score: **9.2/10**
- Verpakking: 9.5/10 (100% plastic-vrij + composteerbaar)
- Ingrediënten: 9.8/10 (OECD 301B + hypoallergeen)
- Productie: 8.5/10 (Nederlandse operaties)
- Bedrijf: 9.0/10 (transparante duurzaamheidsmissie)

#### Estimated Rating: **4.2/5** (to be verified)
#### Review Count: **TBD** (requires research)

---

### 2. **GreenGoods** (Priority: MEDIUM)
**Why add:** Bol.com marketplace presence, trial pack focus, affordable pricing

#### Product Information Needed:
- **Name**: GreenGoods Vaatwasstrips
- **Supplier**: GREENGOODS
- **URL**: Via Bol.com marketplace
- **Current Price**: €34.95 (120 washes) = €0.29 per wash
- **Price Per Wash**: €0.29-0.40
- **Washes Per Pack**: 5 strips (10 washes), 60 strips (120 washes)
- **Description**: Eco-friendly dishwasher strips with flexible dosing system
- **Long Description**: Dutch brand focusing on eco-friendly household products with tear-in-half dosing system

#### Features to Include:
```
features: [
  "100% plastic-vrij",
  "Biologisch afbreekbaar",
  "Scheur-in-tweeën dosering",
  "Verkrijgbaar via Bol.com",
  "Proefpakketten beschikbaar"
]
```

#### Pros/Cons:
```
pros: [
  "Flexibele dosering mogelijk",
  "Verkrijgbaar via Bol.com",
  "Betaalbare proefpakketten",
  "Goed voor beginners"
]

cons: [
  "Geen eigen website",
  "Beperkte productinformatie",
  "Kleinere verpakkingen",
  "Minder premium positionering"
]
```

#### Sustainability Score: **8.5/10**
- Verpakking: 8.8/10 (plastic-vrij, recycleerbaar)
- Ingrediënten: 8.0/10 (biologisch afbreekbaar claim)
- Productie: 8.0/10 (Nederlandse merk, locatie onduidelijk)
- Bedrijf: 8.2/10 (focus op eco-producten, beperkte transparantie)

#### Estimated Rating: **4.0/5** (to be verified)
#### Review Count: **TBD** (check Bol.com reviews)

---

## Data Collection Tasks

### 1. Pricing Research
- [ ] Scrape current Natuwash pricing from website
- [ ] Verify GreenGoods pricing on Bol.com
- [ ] Calculate accurate price-per-wash for both brands
- [ ] Monitor for promotional pricing

### 2. Review Data Collection
- [ ] Check Natuwash website for review system
- [ ] Extract Bol.com reviews for GreenGoods
- [ ] Look for Trustpilot presence
- [ ] Verify review authenticity

### 3. Product Specifications
- [ ] Confirm pack sizes and wash counts
- [ ] Verify ingredient lists and certifications
- [ ] Check availability status
- [ ] Research shipping costs and delivery times

### 4. Images and Media
- [ ] Source product images (comply with usage rights)
- [ ] Create consistent brand imagery
- [ ] Ensure mobile-optimized visuals

---

## Database Schema Updates

### New Product Entries
```sql
-- Natuwash
INSERT INTO Product (
  slug: 'natuwash',
  name: 'Natuwash',
  supplier: 'NATUWASH',
  currentPrice: TBD,
  pricePerWash: TBD,
  washesPerPack: TBD,
  sustainability: 9.2,
  rating: 4.2,
  reviewCount: TBD,
  inStock: true,
  availability: 'Online only',
  features: ['OECD 301B Gecertificeerd', 'Hypoallergeen', ...],
  pros: ['Enige merk met OECD 301B certificering', ...],
  cons: ['Beperkte online aanwezigheid', ...]
);

-- GreenGoods
INSERT INTO Product (
  slug: 'greengoods',
  name: 'GreenGoods',
  supplier: 'GREENGOODS',
  currentPrice: 34.95,
  pricePerWash: 0.29,
  washesPerPack: 120,
  sustainability: 8.5,
  rating: 4.0,
  reviewCount: TBD,
  inStock: true,
  availability: 'Bol.com',
  features: ['100% plastic-vrij', 'Biologisch afbreekbaar', ...],
  pros: ['Flexibele dosering mogelijk', ...],
  cons: ['Geen eigen website', ...]
);
```

---

## SEO and Content Updates

### New Brand Pages Required
- [ ] `/merken/natuwash` - Individual brand page
- [ ] `/merken/greengoods` - Individual brand page

### Homepage Updates
- [ ] Update "5 Nederlandse merken" to "7 Nederlandse merken"
- [ ] Adjust statistics and comparisons
- [ ] Update comparison tables

### Navigation Updates
- [ ] Add new brands to dropdown menus
- [ ] Update sitemap.xml
- [ ] Create redirects if needed

---

## Marketing Positioning

### Natuwash Positioning
- **Target**: Premium eco-conscious consumers
- **Key Differentiator**: Only OECD 301B certified option
- **Use Cases**: Sensitive skin, maximum sustainability
- **Competitive Advantage**: Scientific certification backing

### GreenGoods Positioning
- **Target**: Price-conscious beginners
- **Key Differentiator**: Trial-friendly approach
- **Use Cases**: First-time strip users, flexible dosing needs
- **Competitive Advantage**: Marketplace availability

---

## Implementation Timeline

### Phase 1: Data Collection (Week 1)
- Research and verify all product data
- Set up scraping for pricing updates
- Collect review data

### Phase 2: Database Integration (Week 2)
- Add products to database
- Create seed data
- Test comparison functionality

### Phase 3: Frontend Updates (Week 3)
- Update product cards and tables
- Create new brand pages
- Update navigation and statistics

### Phase 4: SEO Optimization (Week 4)
- Update meta tags and descriptions
- Submit updated sitemap
- Monitor search performance

---

## Success Metrics

### Immediate Goals
- [ ] Complete market coverage (7/7 Dutch brands)
- [ ] Accurate pricing data for all brands
- [ ] Verified review counts and ratings

### Long-term Goals
- [ ] Increased organic traffic from comprehensive coverage
- [ ] Higher user engagement with more comparison options
- [ ] Better conversion rates from diverse price points

---

## Notes and Considerations

### Challenges
- Natuwash has limited online presence - may require manual research
- GreenGoods operates primarily through Bol.com - scraping may be complex
- Both brands have smaller review bases than established competitors

### Opportunities
- First comparison site to offer complete Dutch market coverage
- Natuwash's OECD certification provides unique selling point
- GreenGoods' trial packs appeal to hesitant first-time buyers

### Risk Mitigation
- Verify all sustainability claims before publication
- Monitor pricing changes more frequently for smaller brands
- Prepare fallback data in case scraping fails