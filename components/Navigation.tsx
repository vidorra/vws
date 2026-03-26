'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSite } from '@/components/SiteProvider';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const site = useSite();

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <nav className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">{site.productNounCapitalized}</span>
              <span className="text-xl font-bold text-brand-gradient">Vergelijker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/#vergelijking" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Vergelijken
            </Link>

            <Link href="/merken" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Merken
            </Link>

            {/* Gids Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('gids')}
                className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium inline-flex items-center"
              >
                Gids
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {openDropdown === 'gids' && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white ring-1 ring-black ring-opacity-5 z-50 shadow-lg">
                  <div className="py-1">
                    <Link href="/gids" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                      Alle gidsen
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <Link href="/gids/beginners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                      Beginners Gids
                    </Link>
                    <Link href="/gids/kopen-tips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                      Kopen Tips
                    </Link>
                    <Link href="/gids/milieuvriendelijk" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                      Milieuvriendelijk
                    </Link>
                    <Link href="/gids/troubleshooting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                      Troubleshooting
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Blog
            </Link>

            <Link href="/productfinder" className="btn-primary px-4 py-2 text-sm font-medium rounded-lg">
              Productfinder
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/#vergelijking" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
              Vergelijken
            </Link>

            <Link href="/merken" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
              Merken
            </Link>

            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-gray-400">Gids</div>
              <Link href="/gids" onClick={() => setIsOpen(false)} className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
                Alle gidsen
              </Link>
              <Link href="/gids/beginners" onClick={() => setIsOpen(false)} className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
                Beginners Gids
              </Link>
              <Link href="/gids/kopen-tips" onClick={() => setIsOpen(false)} className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
                Kopen Tips
              </Link>
              <Link href="/gids/milieuvriendelijk" onClick={() => setIsOpen(false)} className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
                Milieuvriendelijk
              </Link>
            </div>

            <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg">
              Blog
            </Link>

            <Link href="/productfinder" onClick={() => setIsOpen(false)} className="block mx-3 my-2 px-3 py-2 text-base font-medium text-center btn-primary rounded-lg">
              Productfinder
            </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
