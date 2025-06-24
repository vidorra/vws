'use client';

import { useComparison } from './ComparisonContext';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function ComparisonBar() {
  const { selectedProducts, clearSelection } = useComparison();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in when products are selected
    if (selectedProducts.length > 0) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [selectedProducts.length]);
  
  if (selectedProducts.length === 0) return null;
  
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50
      transform transition-transform duration-300 ease-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} product{selectedProducts.length > 1 ? 'en' : ''} geselecteerd
            </span>
            <div className="hidden sm:flex items-center space-x-2">
              {selectedProducts.length < 2 && (
                <span className="text-xs text-gray-400">
                  (selecteer minimaal 2 producten om te vergelijken)
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={clearSelection}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Wis selectie"
            >
              <span className="hidden sm:inline">Wis selectie</span>
              <X className="h-4 w-4 sm:hidden" />
            </button>
            
            <Link
              href={`/vergelijk?products=${selectedProducts.join(',')}`}
              className={`
                px-4 sm:px-6 py-2 rounded-xl font-medium transition-all
                ${selectedProducts.length >= 2
                  ? 'btn-primary text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                }
              `}
              aria-disabled={selectedProducts.length < 2}
            >
              <span className="hidden sm:inline">Vergelijk producten →</span>
              <span className="sm:hidden">Vergelijk →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}