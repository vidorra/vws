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
    description:
      'Vergelijk alle vaatwasstrips op prijs, reinigingskracht en duurzaamheid.',
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
    description:
      'Vergelijk alle wasstrips op prijs, duurzaamheid en wasresultaat.',
    productNoun: 'wasstrips',
    productNounSingular: 'wasstrip',
    productNounCapitalized: 'Wasstrips',
    canonicalBase: 'https://wasstripsvergelijker.nl',
    contactEmail: 'info@wasstripsvergelijker.nl',
  },
};
