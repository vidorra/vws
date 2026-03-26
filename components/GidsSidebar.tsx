import Link from 'next/link';
import { BookOpen, Search, ArrowRight, ExternalLink } from 'lucide-react';

interface RelatedGuide {
  href: string;
  title: string;
  description: string;
}

interface SisterSiteInfo {
  name: string;
  url: string;
  productNoun: string;
}

interface GidsSidebarProps {
  relatedGuides?: RelatedGuide[];
  sisterSite?: SisterSiteInfo;
}

export default function GidsSidebar({ relatedGuides = [], sisterSite }: GidsSidebarProps) {
  return (
    <div className="col-span-12 lg:col-span-5 space-y-6">
      <div className="hidden lg:block space-y-6">
        {/* Productfinder CTA */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-primary">Productfinder</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Vind het beste product voor jouw situatie met onze interactieve keuzehulp.
          </p>
          <Link
            href="/productfinder"
            className="inline-flex items-center px-4 py-2 btn-primary rounded-lg text-sm"
          >
            Start Productfinder
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Gerelateerde Gidsen</h3>
            </div>
            <div className="space-y-3">
              {relatedGuides.map((guide, index) => (
                <Link
                  key={index}
                  href={guide.href}
                  className="block p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="font-medium text-primary text-sm">{guide.title} &rarr;</div>
                  <div className="text-xs text-gray-600 mt-1">{guide.description}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Vergelijk CTA */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-3">Vergelijk Producten</h3>
          <p className="text-gray-600 text-sm mb-4">
            Bekijk alle producten naast elkaar en vergelijk op prijs, rating en ingrediënten.
          </p>
          <Link
            href="/#vergelijking"
            className="inline-flex items-center text-primary text-sm font-medium hover:underline"
          >
            Bekijk vergelijking
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Sister Site Cross-link */}
        {sisterSite && (
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-3">
              <ExternalLink className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Ook {sisterSite.productNoun}?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Bekijk onze zustersite voor een onafhankelijke vergelijking van {sisterSite.productNoun}.
            </p>
            <a
              href={sisterSite.url}
              rel="noopener"
              className="inline-flex items-center text-primary text-sm font-medium hover:underline"
            >
              {sisterSite.name}
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
