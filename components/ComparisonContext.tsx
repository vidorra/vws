import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ComparisonContextType {
  selectedProducts: string[];
  toggleProduct: (productId: string) => void;
  clearSelection: () => void;
  isSelected: (productId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);
const MAX_COMPARISON_ITEMS = 4;
const STORAGE_KEY = 'vaatwasstrips-comparison';

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedProducts(parsed.slice(0, MAX_COMPARISON_ITEMS));
        }
      } catch (e) {
        console.error('Failed to parse stored comparison:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        // Show toast notification
        alert(`Maximaal ${MAX_COMPARISON_ITEMS} producten vergelijken`);
        return prev;
      }
      return [...prev, productId];
    });
  };

  const clearSelection = () => setSelectedProducts([]);
  const isSelected = (productId: string) => selectedProducts.includes(productId);
  const canAddMore = selectedProducts.length < MAX_COMPARISON_ITEMS;

  return (
    <ComparisonContext.Provider value={{
      selectedProducts,
      toggleProduct,
      clearSelection,
      isSelected,
      canAddMore
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};