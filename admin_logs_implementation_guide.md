# Admin Panel Scraping Logs Implementation Guide

## Overview
This guide will add a comprehensive scraping logs viewer to your admin panel with tabs for better organization. You'll be able to view detailed scraping history, filter logs, and monitor system performance.

## 🎯 What We'll Build

- **Tabbed interface** on `/data-beheer` with Dashboard and Logs tabs
- **Real-time log viewer** with filtering and search
- **Scraping statistics** and performance metrics
- **Log cleanup functionality** for maintenance

---

## Step 1: Create the Scraping Logs API Endpoint

Create the file `app/api/admin/scraping-logs/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const supplier = searchParams.get('supplier');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter conditions
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (supplier) {
      where.supplier = {
        contains: supplier,
        mode: 'insensitive'
      };
    }

    // Fetch logs from database
    const logs = await prisma.scrapingLog.findMany({
      where,
      orderBy: {
        startedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.scrapingLog.count({ where });

    // Calculate summary statistics for last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const summary = await prisma.scrapingLog.groupBy({
      by: ['status'],
      where: {
        startedAt: {
          gte: oneDayAgo
        }
      },
      _count: {
        status: true
      }
    });

    const summaryStats = {
      total: summary.reduce((acc, item) => acc + item._count.status, 0),
      successful: summary.find(s => s.status === 'success')?._count.status || 0,
      failed: summary.find(s => s.status === 'failed')?._count.status || 0,
      running: summary.find(s => s.status === 'running')?._count.status || 0
    };

    // Get average scraping duration
    const avgDuration = await prisma.scrapingLog.aggregate({
      where: {
        status: 'success',
        duration: { not: null },
        startedAt: { gte: oneDayAgo }
      },
      _avg: {
        duration: true
      }
    });

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log.id,
        productId: log.productId,
        supplier: log.supplier,
        status: log.status,
        message: log.message,
        oldPrice: log.oldPrice,
        newPrice: log.newPrice,
        priceChange: log.priceChange,
        startedAt: log.startedAt,
        completedAt: log.completedAt,
        duration: log.duration
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      summary: {
        ...summaryStats,
        avgDuration: avgDuration._avg.duration || 0
      }
    });

  } catch (error) {
    console.error('Error fetching scraping logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for cleaning old logs
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete logs older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const deletedLogs = await prisma.scrapingLog.deleteMany({
      where: {
        startedAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    return NextResponse.json({
      message: `Deleted ${deletedLogs.count} old log entries`,
      deletedCount: deletedLogs.count
    });

  } catch (error) {
    console.error('Error cleaning up logs:', error);
    return NextResponse.json(
      { error: 'Failed to clean up logs' },
      { status: 500 }
    );
  }
}
```

---

## Step 2: Create the Logs Viewer Component

Create the file `app/data-beheer/components/ScrapingLogsViewer.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';

interface ScrapingLog {
  id: string;
  productId?: string;
  supplier: string;
  status: 'success' | 'failed' | 'running';
  message?: string;
  oldPrice?: number;
  newPrice?: number;
  priceChange?: number;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

interface LogsSummary {
  total: number;
  successful: number;
  failed: number;
  running: number;
  avgDuration: number;
}

interface LogsResponse {
  logs: ScrapingLog[];
  summary: LogsSummary;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function ScrapingLogsViewer() {
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        status: filter,
        ...(supplierFilter && { supplier: supplierFilter })
      });

      const response = await fetch(`/api/admin/scraping-logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const logsData = await response.json();
        setData(logsData);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldLogs = async () => {
    if (!confirm('Weet je zeker dat je oude logs (ouder dan 30 dagen) wilt verwijderen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/scraping-logs', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`${result.deletedCount} oude logs verwijderd`);
        fetchLogs(); // Refresh the list
      }
    } catch (error) {
      console.error('Error cleaning logs:', error);
      alert('Fout bij het opschonen van logs');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter, supplierFilter]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(fetchLogs, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, filter, supplierFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'running': return '🔄';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'running': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`;
  };

  const formatPriceChange = (change?: number) => {
    if (!change) return null;
    const prefix = change > 0 ? '+' : '';
    const color = change > 0 ? 'text-red-600' : 'text-green-600';
    const bgColor = change > 0 ? 'bg-red-50' : 'bg-green-50';
    return (
      <span className={`${color} ${bgColor} px-2 py-1 rounded text-sm font-medium`}>
        {prefix}€{change.toFixed(2)}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Logs laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📊</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Totaal (24u)</p>
                <p className="text-lg font-semibold text-gray-900">{data.summary.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Succesvol</p>
                <p className="text-lg font-semibold text-gray-900">{data.summary.successful}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <span className="text-red-600 font-semibold">❌</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Mislukt</p>
                <p className="text-lg font-semibold text-gray-900">{data.summary.failed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">⏱️</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Gem. Duur</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDuration(data.summary.avgDuration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Filter
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'success' | 'failed')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Alle statussen</option>
                <option value="success">Succesvol</option>
                <option value="failed">Mislukt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merk Filter
              </label>
              <input
                type="text"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                placeholder="Filter op merk..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700">
                Auto-vernieuwen (30s)
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchLogs}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🔄 Vernieuwen
            </button>
            
            <button
              onClick={cleanupOldLogs}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              🗑️ Opschonen
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Scraping Logs 
            {data?.pagination && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({data.pagination.total} totaal)
              </span>
            )}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oude Prijs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nieuwe Prijs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verandering
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tijdstip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bericht
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!data?.logs || data.logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📝</span>
                      <p>Geen logs gevonden voor de geselecteerde filters.</p>
                      <p className="text-sm mt-1">Probeer de filters aan te passen of voer een handmatige scrape uit.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{getStatusIcon(log.status)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.oldPrice ? `€${log.oldPrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.newPrice ? `€${log.newPrice.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatPriceChange(log.priceChange) || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(log.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(log.startedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={log.message}>
                        {log.message || '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {data?.pagination && data.pagination.hasMore && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Toont {data.logs.length} van {data.pagination.total} logs. 
              <button className="ml-2 text-blue-600 hover:text-blue-800 font-medium">
                Meer laden
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Step 3: Update the Main Admin Page with Tabs

Update your existing `app/data-beheer/page.tsx` to include tabs:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScrapingLogsViewer from './components/ScrapingLogsViewer';

// Your existing interfaces...
interface Product {
  id: string;
  name: string;
  supplier: string;
  price: number;
  pricePerWash: number;
  inStock: boolean;
  lastChecked: string;
  rating: number;
  reviewCount: number;
}

type TabType = 'dashboard' | 'logs';

export default function DataBeheerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScrape, setLastScrape] = useState<string | null>(null);
  const [scrapingStatus, setScrapingStatus] = useState<string>('idle');
  const router = useRouter();

  // Your existing functions (fetchDashboardData, triggerManualScrape, etc.)...
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/data-beheer/login');
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setLastScrape(data.lastScrape);
        setScrapingStatus(data.scrapingStatus || 'idle');
      } else {
        router.push('/data-beheer/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      router.push('/data-beheer/login');
    } finally {
      setLoading(false);
    }
  };

  const triggerManualScrape = async () => {
    try {
      setScrapingStatus('running');
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Scraping result:', result);
        setScrapingStatus('completed');
        setTimeout(() => {
          fetchDashboardData();
          setScrapingStatus('idle');
        }, 2000);
      } else {
        setScrapingStatus('failed');
        setTimeout(() => setScrapingStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error triggering scrape:', error);
      setScrapingStatus('failed');
      setTimeout(() => setScrapingStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'logs', name: 'Scraping Logs', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Scraping Controls */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
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
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {scrapingStatus === 'running' ? '🔄 Bezig...' : '🚀 Start Handmatige Scrape'}
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
                              Rating
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                  <span className="text-4xl mb-2">📦</span>
                                  <p>Geen producten gevonden.</p>
                                  <p className="text-sm mt-1">Voer een scrape uit om productdata te laden.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            products.map((product) => (
                              <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.supplier}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">€{product.price.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">€{product.pricePerWash.toFixed(3)}</div>
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
                                  {new Date(product.lastChecked).toLocaleString('nl-NL')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                                    <span className="ml-1 text-yellow-400">⭐</span>
                                    <span className="ml-2 text-sm text-gray-500">({product.reviewCount})</span>
                                  </div>
                                </td>
                              </tr>
                            ))
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
    </div>
  );
}
```

---

## Step 4: Create the Components Directory

Create the directory structure if it doesn't exist:

```bash
mkdir -p app/data-beheer/components
```

Then save the `ScrapingLogsViewer.tsx` component in that directory.

---

## Step 5: Test the Implementation

### 5.1 Deploy and Test

```bash
# 1. Commit and deploy your changes
git add .
git commit -m "Add scraping logs viewer with tabs to admin panel"
git push origin main
npm run deploy

# 2. Test the admin panel
# Go to: http://vaatwasstripsvergelijker.server.devjens.nl/data-beheer
# Login and click on the "Scraping Logs" tab
```

### 5.2 Generate Test Data (Optional)

If you don't have logs yet, you can create some test entries:

```bash
# Run a manual scrape to generate logs
# Go to Dashboard tab → Click "Start Handmatige Scrape"
# Then check the Logs tab to see the results
```

---

## Step 6: Enhance with Additional Features

### 6.1 Add Export Functionality

Add this function to your `ScrapingLogsViewer.tsx`:

```typescript
const exportLogs = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams({
      status: filter,
      limit: '1000', // Export more logs
      ...(supplierFilter && { supplier: supplierFilter })
    });

    const response = await fetch(`/api/admin/scraping-logs?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Convert to CSV
      const csv = [
        'Status,Merk,Oude Prijs,Nieuwe Prijs,Verandering,Duur,Tijdstip,Bericht',
        ...data.logs.map((log: ScrapingLog) => [
          log.status,
          log.supplier,
          log.oldPrice || '',
          log.newPrice || '',
          log.priceChange || '',
          log.duration || '',
          new Date(log.startedAt).toISOString(),
          log.message || ''
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraping-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
  }
};
```

Then add the export button to your controls:

```typescript
<button
  onClick={exportLogs}
  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
>
  📊 Exporteren
</button>
```

### 6.2 Add Real-time Updates

For real-time log updates during scraping, you can add a WebSocket connection or use polling:

```typescript
// Add to your ScrapingLogsViewer component
useEffect(() => {
  const pollForUpdates = async () => {
    // Only poll if scraping is active
    const currentStatus = localStorage.getItem('scrapingStatus');
    if (currentStatus === 'running') {
      await fetchLogs();
    }
  };

  const interval = setInterval(pollForUpdates, 5000); // Check every 5 seconds
  return () => clearInterval(interval);
}, []);
```

---

## Step 7: Verify Everything Works

### ✅ Checklist

After implementation, verify these features:

- [ ] **Tabs work**: Can switch between Dashboard and Logs
- [ ] **Logs display**: Shows existing scraping logs with proper formatting
- [ ] **Filtering works**: Can filter by status and supplier
- [ ] **Auto-refresh**: Logs update automatically every 30 seconds
- [ ] **Statistics**: Summary cards show correct counts
- [ ] **Manual refresh**: Refresh button updates logs immediately
- [ ] **Cleanup function**: Can delete old logs
- [ ] **Responsive design**: Works on mobile and desktop
- [ ] **Error handling**: Shows appropriate messages for empty states

### 🎯 Expected Result

You should now have:

1. **Professional tabbed interface** on `/data-beheer`
2. **Comprehensive logs viewer** with filtering and statistics
3. **Real-time monitoring** of scraping operations
4. **Easy maintenance** with log cleanup functionality
5. **Export capabilities** for analysis

---

## Troubleshooting

### Issue: Logs not showing
**Solution**: Check that you have ScrapingLog entries in your database. Run a manual scrape first.

### Issue: API errors
**Solution**: Verify the API endpoint exists and authentication is working.

### Issue: Styling issues
**Solution**: Ensure you have Tailwind CSS configured properly.

### Issue: TypeScript errors
**Solution**: Check import paths and interface definitions match your project structure.

---

## Next Steps

After implementing the logs viewer, you can:

1. **Add more detailed filtering** (date ranges, duration thresholds)
2. **Implement charts** for scraping performance visualization
3. **Add email notifications** for failed scrapes
4. **Create automated reports** for scraping health
5. **Add log retention policies** for better performance

This implementation gives you complete visibility into your scraping operations and professional monitoring capabilities!