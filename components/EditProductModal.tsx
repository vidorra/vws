'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  washCount: number;
  price: number;
  pricePerWash: number;
  inStock: boolean;
  isDefault: boolean;
}

interface Product {
  id: string;
  name: string;
  supplier: string;
  price: number | null;
  currentPrice?: number;
  pricePerWash?: number | null;
  washesPerPack?: number;
  inStock: boolean;
  url?: string;
  description?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  sustainability?: number;
  rating?: number;
  displayOrder?: number;
  lastUpdated?: string | null;
  variants?: ProductVariant[];
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    supplier: '',
    price: 0,
    currentPrice: 0,
    pricePerWash: 0,
    washesPerPack: 0,
    inStock: true,
    url: '',
    description: '',
    features: [],
    pros: [],
    cons: [],
    sustainability: 0,
    rating: 0,
    displayOrder: 999,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleArrayInput = (field: 'features' | 'pros' | 'cons', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Product Bewerken</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leverancier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prijs (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.currentPrice || formData.price || 0}
                onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value), price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prijs per wasbeurt (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerWash || ''}
                onChange={(e) => setFormData({ ...formData, pricePerWash: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wasbeurten per verpakking
              </label>
              <input
                type="number"
                value={formData.washesPerPack || 0}
                onChange={(e) => setFormData({ ...formData, washesPerPack: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voorraad
              </label>
              <select
                value={formData.inStock ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="true">Op voorraad</option>
                <option value="false">Uitverkocht</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duurzaamheid (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.sustainability || ''}
                onChange={(e) => setFormData({ ...formData, sustainability: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beoordeling (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weergave volgorde
              </label>
              <input
                type="number"
                min="0"
                value={formData.displayOrder || 999}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 999 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Lagere nummers verschijnen eerst"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bepaalt de standaard volgorde op de homepage (0-999)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschrijving
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kenmerken (gescheiden door komma's)
            </label>
            <input
              type="text"
              value={formData.features?.join(', ') || ''}
              onChange={(e) => handleArrayInput('features', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Biologisch afbreekbaar, Fosfaatvrij, Vegan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voordelen (gescheiden door komma's)
            </label>
            <input
              type="text"
              value={formData.pros?.join(', ') || ''}
              onChange={(e) => handleArrayInput('pros', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Milieuvriendelijk, Compact, Geen plastic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nadelen (gescheiden door komma's)
            </label>
            <input
              type="text"
              value={formData.cons?.join(', ') || ''}
              onChange={(e) => handleArrayInput('cons', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Minder effectief bij hardnekkige vlekken"
            />
          </div>

          {/* Variants section - read only */}
          {formData.variants && formData.variants.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Varianten (alleen lezen)</h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {formData.variants.map((variant) => (
                  <div key={variant.id} className="bg-white rounded border border-gray-200 p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-medium">{variant.name}</span>
                        {variant.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Standaard
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500">Wasbeurten:</span> {variant.washCount}
                      </div>
                      <div>
                        <span className="text-gray-500">Prijs:</span> €{variant.price.toFixed(2)}
                      </div>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          variant.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {variant.inStock ? 'Op voorraad' : 'Uitverkocht'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  * Varianten worden automatisch bijgewerkt tijdens het scrapen
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}