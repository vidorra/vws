export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { getProductsSafe } from '@/lib/db-safe';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'Vaatwasstrips Vergelijken Nederland 2025 - Onafhankelijke Vergelijking',
  description: 'Vergelijk alle Nederlandse vaatwasstrips merken op prijs, duurzaamheid en prestaties. Transparante duurzaamheidsscores, actuele prijzen en geverifieerde reviews.',
  keywords: 'vaatwasstrips, vergelijken, nederland, prijs, duurzaamheid, milieuvriendelijk, afwassen, 2025',
  openGraph: {
    title: 'Vaatwasstrips Vergelijker Nederland 2025',
    description: 'Onafhankelijke vergelijking van alle Nederlandse aanbieders',
    type: 'website',
    url: 'https://vaatwasstripsvergelijker.nl',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaatwasstrips Vergelijker Nederland 2025',
    description: 'Onafhankelijke vergelijking van alle Nederlandse aanbieders'
  }
};

export default async function Page() {
  // Fetch products from database with error handling
  const products = await getProductsSafe();
  
  return <HomePage initialProducts={products} />;
}