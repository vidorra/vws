import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Star, Leaf, Euro, Truck, Shield, Award, TrendingDown, Filter, ExternalLink, RefreshCw } from 'lucide-react';

const VaatwasstripsVergelijker = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulated data - in real app this would come from APIs
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Mother's Earth",
      logo: "🌍",
      pricePerWash: 0.17,
      originalPrice: 0.25,
      strips: 30,
      totalWashes: 60,
      packagePrice: 10.20,
      rating: 4.6,
      reviews: 1247,
      features: ["Plantaardig", "30 dagen garantie", "Doneert aan goede doelen", "CO2 neutraal"],
      pros: ["Goedkoop per wasbeurt", "Biologisch afbreekbaar", "Ethisch verantwoord"],
      cons: ["Lange levertijd (5-9 dagen)", "Verzending vanuit China"],
      availability: "Online only",
      website: "mothersearth.com",
      inStock: true,
      trending: true,
      bestValue: true,
      sustainabilityScore: 9.2,
      colors: {
        primary: "#22c55e",
        secondary: "#dcfce7"
      }
    },
    {
      id: 2,
      name: "Cosmeau",
      logo: "🧽",
      pricePerWash: 0.25,
      originalPrice: 0.35,
      strips: 30,
      totalWashes: 60,
      packagePrice: 15.00,
      rating: 4.3,
      reviews: 892,
      features: ["Anti-bacterieel", "Enzyme formule", "Vrij van parabenen", "Nederlandse webshop"],
      pros: ["Snelle levering", "Breed verkrijgbaar", "Goede klantenservice"],
      cons: ["Hoger prijspunt", "Schuimvorming bij kleine vaatwassers"],
      availability: "Online + Winkels",
      website: "cosmeau.com",
      inStock: true,
      trending: false,
      bestValue: false,
      sustainabilityScore: 8.5,
      colors: {
        primary: "#3b82f6",
        secondary: "#dbeafe"
      }
    },
    {
      id: 3,
      name: "Bubblyfy",
      logo: "💧",
      pricePerWash: 0.22,
      originalPrice: 0.30,
      strips: 32,
      totalWashes: 64,
      packagePrice: 14.08,
      rating: 4.4,
      reviews: 456,
      features: ["100% natuurlijk", "Enzymen uit planten", "Geld-terug garantie", "Vegan"],
      pros: ["Natuurlijke ingrediënten", "Innovatieve formule", "Goede reviews"],
      cons: ["Beperkte beschikbaarheid", "Relatief nieuw merk"],
      availability: "Online only",
      website: "bubblyfy.nl",
      inStock: true,
      trending: true,
      bestValue: false,
      sustainabilityScore: 9.0,
      colors: {
        primary: "#06b6d4",
        secondary: "#cffafe"
      }
    },
    {
      id: 4,
      name: "Wasstrip.nl",
      logo: "🌿",
      pricePerWash: 0.16,
      originalPrice: 0.23,
      strips: 40,
      totalWashes: 80,
      packagePrice: 12.80,
      rating: 4.2,
      reviews: 234,
      features: ["Hypoallergeen", "Koud & warm water", "Biologisch afbreekbaar", "Grootverpakking"],
      pros: ["Laagste prijs", "Grote verpakkingen", "Allergie-vriendelijk"],
      cons: ["Minder bekende merk", "Beperkte reviews"],
      availability: "Online only",
      website: "wasstrip.nl",
      inStock: true,
      trending: false,
      bestValue: true,
      sustainabilityScore: 8.8,
      colors: {
        primary: "#84cc16",
        secondary: "#ecfccb"
      }
    },
    {
      id: 5,
      name: "Bio-Suds",
      logo: "🍃",
      pricePerWash: 0.29,
      originalPrice: 0.35,
      strips: 30,
      totalWashes: 60,
      packagePrice: 17.40,
      rating: 4.1,
      reviews: 189,
      features: ["Fosfaatvrij", "Chloorvrij", "Premium formule", "Recyclebare verpakking"],
      pros: ["Premium kwaliteit", "Milieuvriendelijke verpakking", "Goede prestaties"],
      cons: ["Duurste optie", "Kleinere community"],
      availability: "Online + Bol.com",
      website: "bio-suds.com",
      inStock: false,
      trending: false,
      bestValue: false,
      sustainabilityScore: 8.7,
      colors: {
        primary: "#10b981",
        secondary: "#d1fae5"
      }
    }
  ]);

  // Traditional alternatives for comparison
  const traditionalProducts = [
    { name: "Dreft Tablets", pricePerWash: 0.68, sustainability: 3.2 },
    { name: "Sun Tablets", pricePerWash: 0.57, sustainability: 3.8 },
    { name: "Finish Tablets", pricePerWash: 0.64, sustainability: 4.1 }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const refreshPrices = () => {
    setLoading(true);
    // Simulate API call to refresh prices
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 2000);
  };

  const filteredSuppliers = suppliers
    .filter(supplier => {
      if (filter === 'in-stock') return supplier.inStock;
      if (filter === 'trending') return supplier.trending;
      if (filter === 'best-value') return supplier.bestValue;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.pricePerWash - b.pricePerWash;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sustainability') return b.sustainabilityScore - a.sustainabilityScore;
      return 0;
    });

  const averageSavings = traditionalProducts.reduce((acc, prod) => acc + prod.pricePerWash, 0) / traditionalProducts.length;
  const bestPrice = Math.min(...suppliers.map(s => s.pricePerWash));
  const savingsPercentage = Math.round(((averageSavings - bestPrice) / averageSavings) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Prijzen worden bijgewerkt...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Vaatwasstrips Vergelijker Nederland - Beste Prijzen 2024</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🧽</div>
              <h1 className="text-xl font-bold text-gray-900">Vaatwasstrips Vergelijker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Laatst bijgewerkt: {lastUpdated.toLocaleTimeString('nl-NL')}
              </span>
              <button
                onClick={refreshPrices}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Prijzen vernieuwen"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vergelijk Vaatwasstrips in Nederland
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ontdek de beste vaatwasstrips voor jouw budget en milieubewustzijn.
            Bespaar tot <span className="font-bold text-green-600">{savingsPercentage}%</span> ten opzichte van traditionele tabletten.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-blue-600">€{bestPrice.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Laagste prijs per wasbeurt</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-green-600">{savingsPercentage}%</div>
              <div className="text-sm text-gray-500">Besparing vs. tablets</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-purple-600">{suppliers.length}</div>
              <div className="text-sm text-gray-500">Aanbieders vergeleken</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-500">Milieuvriendelijk</div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Alle producten', icon: null },
              { key: 'in-stock', label: 'Op voorraad', icon: null },
              { key: 'trending', label: 'Trending', icon: TrendingDown },
              { key: 'best-value', label: 'Beste waarde', icon: Award }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  filter === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
          >
            <option value="price">Sorteer op prijs</option>
            <option value="rating">Sorteer op beoordeling</option>
            <option value="sustainability">Sorteer op duurzaamheid</option>
          </select>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                !supplier.inStock ? 'opacity-75' : ''
              } ${supplier.bestValue ? 'border-green-400' : 'border-gray-200'}`}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{supplier.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{supplier.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{supplier.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({supplier.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    {supplier.trending && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        Trending
                      </span>
                    )}
                    {supplier.bestValue && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Beste waarde
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold" style={{ color: supplier.colors.primary }}>
                        €{supplier.pricePerWash.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">per wasbeurt</div>
                      {supplier.originalPrice > supplier.pricePerWash && (
                        <div className="text-sm text-gray-400 line-through">
                          €{supplier.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        €{supplier.packagePrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {supplier.totalWashes} wasbeurten
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sustainability Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Duurzaamheid</span>
                    <span className="text-sm font-bold text-green-600">
                      {supplier.sustainabilityScore}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${supplier.sustainabilityScore * 10}%` }}
                    ></div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Kenmerken</h4>
                  <div className="flex flex-wrap gap-1">
                    {supplier.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: supplier.colors.secondary,
                          color: supplier.colors.primary
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                    {supplier.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{supplier.features.length - 3} meer
                      </span>
                    )}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-xs font-semibold text-green-600 mb-1">Voordelen</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {supplier.pros.slice(0, 2).map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-red-600 mb-1">Nadelen</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {supplier.cons.slice(0, 2).map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-1">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Beschikbaarheid:</span>
                  <span className="font-medium">{supplier.availability}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      supplier.inStock
                        ? 'text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    style={{
                      backgroundColor: supplier.inStock ? supplier.colors.primary : undefined
                    }}
                    disabled={!supplier.inStock}
                  >
                    {supplier.inStock ? 'Naar website' : 'Uitverkocht'}
                  </button>
                  <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <ExternalLink className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Traditional Products Comparison */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Vergelijking met Traditionele Vaatwastabletten
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Prijs per wasbeurt</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duurzaamheid</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Besparing</th>
                </tr>
              </thead>
              <tbody>
                {traditionalProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">€{product.pricePerWash.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-red-400 h-2 rounded-full"
                            style={{ width: `${product.sustainability * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{product.sustainability}/10</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-red-600 font-semibold">
                        +{Math.round(((product.pricePerWash - bestPrice) / bestPrice) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde Vragen</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Zijn vaatwasstrips even effectief als tabletten?</h4>
              <p className="text-gray-600 text-sm">
                Vaatwasstrips kunnen even effectief zijn, maar de prestaties kunnen variëren per merk en type vervuiling.
                Voor hardnekkige vlekken zoals thee-aanslag kunnen ze minder effectief zijn.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Hoeveel kan ik besparen?</h4>
              <p className="text-gray-600 text-sm">
                Gemiddeld kun je 60-75% besparen ten opzichte van traditionele vaatwastabletten,
                afhankelijk van het merk dat je kiest.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Zijn ze echt milieuvriendelijker?</h4>
              <p className="text-gray-600 text-sm">
                Ja, vaatwasstrips hebben doorgaans minder plastic verpakking, zijn biologisch afbreekbaar
                en bevatten minder schadelijke chemicaliën.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Hoe gebruik ik vaatwasstrips?</h4>
              <p className="text-gray-600 text-sm">
                Scheur een strip doormidden en plaats een halve strip in het vaatwasmiddelvakje.
                Eén strip is goed voor twee wasbeurten.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl mb-4">🧽</div>
            <h3 className="text-xl font-bold mb-2">Vaatwasstrips Vergelijker</h3>
            <p className="text-gray-400 mb-4">
              De meest complete vergelijking van vaatwasstrips in Nederland
            </p>
            <p className="text-sm text-gray-500">
              Prijzen worden dagelijks bijgewerkt • Laatst bijgewerkt: {lastUpdated.toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VaatwasstripsVergelijker;