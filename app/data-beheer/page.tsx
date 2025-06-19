'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, ChevronDown, ChevronUp, BarChart3, FileText, Rocket, RefreshCw, Package } from 'lucide-react';
import EditProductModal from '@/components/EditProductModal';
import ScrapingLogsViewer from './components/ScrapingLogsViewer';

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
  pricePerWash?: number | null;
  inStock: boolean;
  lastUpdated?: string | null;
  currentPrice?: number;
  washesPerPack?: number;
  url?: string;
  description?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  sustainability?: number;
  rating?: number;
  displayOrder?: number;
  variants?: ProductVariant[];
}

type TabType = 'dashboard' | 'logs';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [scrapingStatus, setScrapingStatus] = useState('idle');
  const [lastScrape, setLastScrape] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/data-beheer/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setLastScrape(data.lastScrape);
      } else if (response.status === 401) {
        router.push('/data-beheer/login');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerManualScrape = async () => {
    setScrapingStatus('running');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setScrapingStatus('completed');
        await fetchDashboardData();
        setTimeout(() => setScrapingStatus('idle'), 3000);
      } else {
        setScrapingStatus('failed');
        setTimeout(() => setScrapingStatus('idle'), 3000);
      }
    } catch (error) {
      setScrapingStatus('failed');
      setTimeout(() => setScrapingStatus('idle'), 3000);
    }
  };

  const handleEdit = (product: Product) => {
    // Map the product data to include all fields
    const fullProduct = {
      ...product,
      currentPrice: product.price || 0,
      washesPerPack: product.pricePerWash && product.price
        ? Math.round(product.price / product.pricePerWash)
        : 0,
    };
    setEditingProduct(fullProduct);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        await fetchDashboardData();
      } else {
        alert('Fout bij het opslaan van het product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Fout bij het opslaan van het product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchDashboardData();
      } else {
        alert('Fout bij het verwijderen van het product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Fout bij het verwijderen van het product');
    }
  };

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'logs', name: 'Scraping Logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Data Beheer Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                router.push('/data-beheer/login');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Uitloggen
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 focus:outline-none`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Scraping Controls */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Scraping Beheer</h2>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Laatste scrape: {lastScrape ? new Date(lastScrape).toLocaleString('nl-NL') : 'Nog niet uitgevoerd'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: <span className={`font-medium ${
                            scrapingStatus === 'running' ? 'text-yellow-600' :
                            scrapingStatus === 'completed' ? 'text-green-600' :
                            scrapingStatus === 'failed' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {scrapingStatus === 'running' ? 'Bezig...' :
                             scrapingStatus === 'completed' ? 'Voltooid' :
                             scrapingStatus === 'failed' ? 'Mislukt' : 'Inactief'}
                          </span>
                        </p>
                      </div>
                      
                      <button
                        onClick={triggerManualScrape}
                        disabled={scrapingStatus === 'running'}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                      >
                        {scrapingStatus === 'running' ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Bezig...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4" />
                            <span>Start Handmatige Scrape</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Products Overview */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Product Overzicht</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-50 to-green-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Volgorde
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prijs
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Per Wasbeurt
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Voorraad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Laatste Update
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acties
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                  <Package className="h-12 w-12 text-gray-400 mb-2" />
                                  <p>Geen producten gevonden.</p>
                                  <p className="text-sm mt-1">Voer een scrape uit om productdata te laden.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            products.map((product) => {
                              const hasVariants = product.variants && product.variants.length > 0;
                              const isExpanded = expandedProducts.has(product.id);
                              
                              return (
                                <React.Fragment key={product.id}>
                                  <tr className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        {product.displayOrder || 999}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        {hasVariants && (
                                          <button
                                            onClick={() => toggleProductExpansion(product.id)}
                                            className="mr-2 text-gray-500 hover:text-gray-700"
                                          >
                                            {isExpanded ? (
                                              <ChevronUp className="h-4 w-4" />
                                            ) : (
                                              <ChevronDown className="h-4 w-4" />
                                            )}
                                          </button>
                                        )}
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                          <div className="text-sm text-gray-500">{product.supplier}</div>
                                          {hasVariants && product.variants && (
                                            <div className="text-xs text-gray-400 mt-1">
                                              {product.variants.length} variant{product.variants.length > 1 ? 'en' : ''}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        €{product.price?.toFixed(2) || 'N/A'}
                                      </div>
                                      {hasVariants && (
                                        <div className="text-xs text-gray-500">
                                          Standaard variant
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        €{product.pricePerWash?.toFixed(3) || 'N/A'}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        product.inStock
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {product.inStock ? 'Op voorraad' : 'Uitverkocht'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {product.lastUpdated ? new Date(product.lastUpdated).toLocaleString('nl-NL') : 'Nooit'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex items-center space-x-3">
                                        <button
                                          onClick={() => handleEdit(product)}
                                          className="text-indigo-600 hover:text-indigo-900"
                                          title="Bewerken"
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(product.id)}
                                          className="text-red-600 hover:text-red-900"
                                          title="Verwijderen"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                  
                                  {/* Expanded variants section */}
                                  {hasVariants && isExpanded && (
                                    <tr>
                                      <td colSpan={7} className="px-6 py-4 bg-gray-100">
                                        <div className="ml-8">
                                          <h4 className="text-sm font-medium text-gray-900 mb-3">Varianten</h4>
                                          <div className="space-y-2">
                                            {product.variants?.map((variant) => (
                                              <div key={variant.id} className="bg-white rounded-lg border border-gray-200 p-3">
                                                <div className="grid grid-cols-5 gap-4 text-sm">
                                                  <div>
                                                    <span className="font-medium">{variant.name}</span>
                                                    {variant.isDefault && (
                                                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
                                                    <span className="text-gray-500">Per wasbeurt:</span> €{variant.pricePerWash.toFixed(3)}
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
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <ScrapingLogsViewer />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
}