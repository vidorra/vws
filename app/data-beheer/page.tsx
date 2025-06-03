'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  supplier: string;
  price: number | null;
  pricePerWash: number | null;
  inStock: boolean;
  lastUpdated: string | null;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrapingStatus, setScrapingStatus] = useState('idle');
  const [lastScrape, setLastScrape] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Data Beheer Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                router.push('/data-beheer/login');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Uitloggen
            </button>
          </div>

          {/* Scraping Controls */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
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
                className="px-4 py-2 rounded-md btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scrapingStatus === 'running' ? 'Bezig...' : 'Start Handmatige Scrape'}
              </button>
            </div>
          </div>

          {/* Products Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Product Overzicht</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Geen producten gevonden. Start een scrape om data op te halen.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          €{product.price?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          €{product.pricePerWash?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'Op voorraad' : 'Uitverkocht'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.lastUpdated ? new Date(product.lastUpdated).toLocaleString('nl-NL') : 'Nooit'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Bewerken
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}