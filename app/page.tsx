export const revalidate = 300; // revalidate every 5 minutes

import { getProductsSafe } from '@/lib/db-safe';
import { getSite } from '@/lib/get-site';
import HomePage from './HomePage';

export default async function Page() {
  const site = getSite();
  const products = await getProductsSafe(site.key);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.canonicalBase,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.canonicalBase}/merken/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.productNounCapitalized} vergelijking Nederland`,
    url: site.canonicalBase,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${site.canonicalBase}/merken/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HomePage initialProducts={products} />
    </>
  );
}
