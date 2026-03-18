import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import CookieConsent from '@/components/CookieConsent';
import { SiteProvider } from '@/components/SiteProvider';
import { getSite } from '@/lib/get-site';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const year = new Date().getFullYear();
  return {
    metadataBase: new URL(site.canonicalBase),
    title: {
      default: `${site.name} Nederland ${year} - Onafhankelijke Vergelijking`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: `${site.productNoun}, vergelijken, nederland, prijs, duurzaamheid, milieuvriendelijk`,
    openGraph: {
      title: `${site.name} Nederland`,
      description: site.description,
      images: ['/og-image.jpg'],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  const year = new Date().getFullYear();

  return (
    <html lang="nl" data-site={site.key}>
      <body className={`${inter.className} bg-brand-gradient-light`}>
        <SiteProvider config={site}>
          <Navigation />
          <main className="pt-24">{children}</main>
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Over Ons</h3>
                  <p className="text-sm text-gray-600">
                    {site.name} helpt je de beste keuze te maken voor milieuvriendelijk{' '}
                    {site.key === 'vaatwasstrips' ? 'afwassen' : 'wassen'}.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Snelle Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/merken" className="text-gray-600 hover:text-blue-600">
                        Alle Merken
                      </Link>
                    </li>
                    <li>
                      <Link href="/prijzen/goedkoopste" className="text-gray-600 hover:text-blue-600">
                        Goedkoopste Opties
                      </Link>
                    </li>
                    <li>
                      <Link href="/gids/beginners" className="text-gray-600 hover:text-blue-600">
                        Beginners Gids
                      </Link>
                    </li>
                    <li>
                      <Link href="/reviews" className="text-gray-600 hover:text-blue-600">
                        Reviews
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacybeleid" className="text-gray-600 hover:text-blue-600">
                        Privacybeleid
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                  <p className="text-sm text-gray-600">
                    Vragen of suggesties?
                    <br />
                    {site.contactEmail}
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                <p>
                  &copy; {year} {site.name}. Alle rechten voorbehouden.
                </p>
              </div>
            </div>
          </footer>
          <CookieConsent />
        </SiteProvider>
      </body>
    </html>
  );
}
