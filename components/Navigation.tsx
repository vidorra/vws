'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Vaatwasstrips</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Vergelijker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>

            {/* Merken Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('merken')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center"
              >
                Merken
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {openDropdown === 'merken' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link href="/merken" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Alle merken
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <Link href="/merken/mothers-earth" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mother's Earth
                    </Link>
                    <Link href="/merken/cosmeau" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Cosmeau
                    </Link>
                    <Link href="/merken/bubblyfy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Bubblyfy
                    </Link>
                    <Link href="/merken/bio-suds" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Bio Suds
                    </Link>
                    <Link href="/merken/natuwash" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Natuwash
                    </Link>
                    <Link href="/merken/greengoods" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      GreenGoods
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Prijzen Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('prijzen')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center"
              >
                Prijzen
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {openDropdown === 'prijzen' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link href="/prijzen" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Alle categorieën
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <Link href="/prijzen/goedkoopste" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Goedkoopste
                    </Link>
                    <Link href="/prijzen/beste-waarde" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Beste Waarde
                    </Link>
                    <Link href="/prijzen/premium" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Premium
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/reviews" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Reviews
            </Link>

            {/* Gids Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('gids')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center"
              >
                Gids
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {openDropdown === 'gids' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link href="/gids" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Alle gidsen
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <Link href="/gids/beginners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Beginners Gids
                    </Link>
                    <Link href="/gids/milieuvriendelijk" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Milieuvriendelijk
                    </Link>
                    <Link href="/gids/kopen-tips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Kopen Tips
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Blog
            </Link>

            <Link href="/methodologie" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Methodologie
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              Home
            </Link>
            
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-500">Merken</div>
              <Link href="/merken" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Alle merken
              </Link>
              <Link href="/merken/mothers-earth" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Mother's Earth
              </Link>
              <Link href="/merken/cosmeau" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Cosmeau
              </Link>
              <Link href="/merken/bubblyfy" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Bubblyfy
              </Link>
              <Link href="/merken/bio-suds" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Bio Suds
              </Link>
              <Link href="/merken/natuwash" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Natuwash
              </Link>
              <Link href="/merken/greengoods" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                GreenGoods
              </Link>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-500">Prijzen</div>
              <Link href="/prijzen" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Alle categorieën
              </Link>
              <Link href="/prijzen/goedkoopste" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Goedkoopste
              </Link>
              <Link href="/prijzen/beste-waarde" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Beste Waarde
              </Link>
              <Link href="/prijzen/premium" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Premium
              </Link>
            </div>

            <Link href="/reviews" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              Reviews
            </Link>

            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-500">Gids</div>
              <Link href="/gids" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Alle gidsen
              </Link>
              <Link href="/gids/beginners" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Beginners Gids
              </Link>
              <Link href="/gids/milieuvriendelijk" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Milieuvriendelijk
              </Link>
              <Link href="/gids/kopen-tips" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Kopen Tips
              </Link>
            </div>

            <Link href="/blog" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              Blog
            </Link>

            <Link href="/methodologie" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              Methodologie
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}