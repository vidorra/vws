'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Star, Leaf, ShoppingCart, Sparkles } from 'lucide-react';
import { useSite } from '@/components/SiteProvider';

// --- Types ---

interface QuizAnswer {
  household: string;
  water: string;
  sustainability: string;
  budget: string;
  scent: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  supplier: string;
  description: string | null;
  url: string | null;
  currentPrice: number | null;
  pricePerWash: number | null;
  sustainability: number | null;
  rating: number | null;
  reviewCount: number;
  features: string[];
  pros: string[];
  inStock: boolean;
}

interface ScoredProduct extends Product {
  score: number;
  reasons: string[];
}

type QuestionKey = keyof QuizAnswer;

interface QuizQuestion {
  key: QuestionKey;
  title: string;
  subtitle: string;
  options: { value: string; label: string; description: string; icon: string }[];
}

// --- Scoring ---

function scoreProduct(product: Product, answers: QuizAnswer): ScoredProduct {
  let score = 0;
  const reasons: string[] = [];

  // Budget scoring (30 points max)
  const ppw = product.pricePerWash ?? 0;
  if (answers.budget === 'budget') {
    if (ppw > 0 && ppw < 0.20) { score += 30; reasons.push('Zeer scherpe prijs per wasbeurt'); }
    else if (ppw < 0.30) { score += 20; reasons.push('Goede prijs-kwaliteit verhouding'); }
    else { score += 5; }
  } else if (answers.budget === 'midden') {
    if (ppw >= 0.15 && ppw <= 0.35) { score += 25; reasons.push('Past bij gemiddeld budget'); }
    else { score += 10; }
  } else if (answers.budget === 'premium') {
    score += 15; // Premium users care less about price
    if ((product.sustainability ?? 0) > 8) { score += 15; reasons.push('Premium kwaliteit en duurzaamheid'); }
  }

  // Sustainability scoring (30 points max)
  const sus = product.sustainability ?? 5;
  if (answers.sustainability === 'heel') {
    if (sus >= 9) { score += 30; reasons.push('Uitzonderlijk hoge duurzaamheidsscore'); }
    else if (sus >= 8) { score += 22; reasons.push('Sterke duurzaamheidsscore'); }
    else if (sus >= 7) { score += 12; }
    else { score += 3; }
  } else if (answers.sustainability === 'beetje') {
    if (sus >= 7) { score += 15; reasons.push('Goede duurzaamheidsscore'); }
    else { score += 8; }
  } else {
    score += 10; // Flat — sustainability doesn't matter
  }

  // Rating bonus (15 points max)
  const rating = product.rating ?? 0;
  if (rating >= 4.5) { score += 15; reasons.push(`Hoge gebruikersbeoordeling (${rating}/5)`); }
  else if (rating >= 4.0) { score += 10; }
  else if (rating >= 3.5) { score += 5; }

  // Household size: prefer larger packs / better bulk value (15 points max)
  if (answers.household === 'groot-gezin' || answers.household === 'gezin') {
    if (ppw > 0 && ppw < 0.25) { score += 15; reasons.push('Voordelig bij veel wasbeurten'); }
    else if (ppw < 0.35) { score += 8; }
  } else {
    score += 10; // Small households — most products work fine
  }

  // In-stock bonus (10 points)
  if (product.inStock) { score += 10; }
  else { reasons.push('Momenteel niet op voorraad'); }

  // Ensure at least 2 reasons
  if (reasons.length === 0) reasons.push('Solide keuze voor jouw situatie');

  return { ...product, score, reasons };
}

// --- Component ---

export default function ProductfinderPage() {
  const site = useSite();
  const isVaatwas = site.key === 'vaatwasstrips';

  const questions: QuizQuestion[] = [
    {
      key: 'household',
      title: 'Hoe groot is je huishouden?',
      subtitle: `Dit helpt ons de juiste ${site.productNounSingular} verpakking te adviseren`,
      options: [
        { value: '1-persoon', label: '1 persoon', description: 'Alleen', icon: '👤' },
        { value: '2-personen', label: '2 personen', description: 'Koppel', icon: '👥' },
        { value: 'gezin', label: 'Gezin (3-4)', description: 'Met kinderen', icon: '👨‍👩‍👧' },
        { value: 'groot-gezin', label: 'Groot gezin (5+)', description: 'Veel wasbeurten', icon: '👨‍👩‍👧‍👦' },
      ],
    },
    {
      key: 'water',
      title: 'Wat voor water heb je?',
      subtitle: isVaatwas
        ? 'Hard water kan de werking van vaatwasstrips beïnvloeden'
        : 'Hard water kan de werking van wasstrips beïnvloeden',
      options: [
        { value: 'zacht', label: 'Zacht water', description: 'Groningen, Friesland, Drenthe', icon: '💧' },
        { value: 'gemiddeld', label: 'Gemiddeld', description: 'Noord-Holland, Overijssel', icon: '🚿' },
        { value: 'hard', label: 'Hard water', description: 'Utrecht, Zeeland, Limburg', icon: '🪨' },
        { value: 'weet-niet', label: 'Weet ik niet', description: 'Geen probleem, we adviseren breed', icon: '❓' },
      ],
    },
    {
      key: 'sustainability',
      title: 'Hoe belangrijk is duurzaamheid?',
      subtitle: 'Certificeringen, verpakking en ingrediënten',
      options: [
        { value: 'niet', label: 'Niet belangrijk', description: 'Prijs en resultaat tellen', icon: '💰' },
        { value: 'beetje', label: 'Enigszins', description: 'Liefst duurzaam, maar niet per se', icon: '🌱' },
        { value: 'heel', label: 'Heel belangrijk', description: 'Certificeringen en transparantie', icon: '🌍' },
      ],
    },
    {
      key: 'budget',
      title: 'Wat is je budget?',
      subtitle: 'Per wasbeurt gerekend',
      options: isVaatwas
        ? [
            { value: 'budget', label: 'Budget', description: '< €0.30 per wasbeurt', icon: '💵' },
            { value: 'midden', label: 'Midden', description: '€0.30-0.45 per wasbeurt', icon: '💶' },
            { value: 'premium', label: 'Premium', description: 'Beste kwaliteit, prijs minder belangrijk', icon: '💎' },
          ]
        : [
            { value: 'budget', label: 'Budget', description: '< €0.20 per wasbeurt', icon: '💵' },
            { value: 'midden', label: 'Midden', description: '€0.20-0.35 per wasbeurt', icon: '💶' },
            { value: 'premium', label: 'Premium', description: 'Beste kwaliteit, prijs minder belangrijk', icon: '💎' },
          ],
    },
    {
      key: 'scent',
      title: isVaatwas ? 'Heb je een geurvoorkeur?' : 'Heb je een geurvoorkeur?',
      subtitle: isVaatwas
        ? 'Sommige strips laten een lichte geur achter op servies'
        : 'Wasstrips zijn er in verschillende geuren',
      options: [
        { value: 'geen', label: 'Geen geur', description: 'Geurvrij / hypoallergeen', icon: '🚫' },
        { value: 'licht', label: 'Lichte geur', description: 'Subtiel en fris', icon: '🌸' },
        { value: 'maakt-niet-uit', label: 'Maakt niet uit', description: 'Geen voorkeur', icon: '👍' },
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<ScoredProduct[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    fetch(`/api/products?site=${site.key}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [site.key]);

  const currentQuestion = questions[step];
  const isQuizComplete = step >= questions.length;
  const progress = ((step) / questions.length) * 100;

  function selectAnswer(value: string) {
    const newAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate results
      const scored = products
        .filter((p) => p.inStock)
        .map((p) => scoreProduct(p, newAnswers as QuizAnswer))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setResults(scored);
      setStep(questions.length);
    }
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      setResults(null);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResults(null);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  // --- Results view ---
  if (isQuizComplete && results) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Productfinder</span>
        </nav>

        <div className="text-center mb-12">
          <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Jouw {site.productNounSingular} aanbeveling
          </h1>
          <p className="text-lg text-gray-600">
            Op basis van jouw antwoorden raden wij deze {results.length} {site.productNoun} aan
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {results.map((product, index) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border-2 p-6 md:p-8 ${
                index === 0 ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {index === 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Beste match
                      </span>
                    )}
                    {index === 1 && (
                      <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                        #2
                      </span>
                    )}
                    {index === 2 && (
                      <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                        #3
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.supplier}</h2>
                  <p className="text-gray-500">{product.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {product.score}/100
                  </div>
                  <div className="text-sm text-gray-500">Match score</div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <ShoppingCart className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">
                    {product.pricePerWash ? `€${product.pricePerWash.toFixed(2)}` : '—'}
                  </div>
                  <div className="text-xs text-gray-500">per wasbeurt</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Leaf className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">
                    {product.sustainability ? `${product.sustainability}/10` : '—'}
                  </div>
                  <div className="text-xs text-gray-500">duurzaamheid</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">
                    {product.rating ? `${product.rating}/5` : '—'}
                  </div>
                  <div className="text-xs text-gray-500">beoordeling</div>
                </div>
              </div>

              {/* Reasons */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Waarom dit merk bij jou past:</h3>
                <ul className="space-y-1">
                  {product.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/merken/${product.slug}`}
                  className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Bekijk volledige review
                </Link>
                {product.url && (
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Naar webshop →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Restart / Back */}
        <div className="text-center space-y-4">
          <button
            onClick={restart}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Opnieuw beginnen
          </button>
          <p className="text-sm text-gray-500">
            Of bekijk het{' '}
            <Link href="/overzicht" className="text-blue-600 hover:underline">
              volledige overzicht
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // --- Quiz view ---
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Productfinder</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {site.productNounCapitalized} Productfinder
        </h1>
        <p className="text-gray-600">
          Beantwoord 5 korte vragen en ontdek welke {site.productNounSingular} het beste bij jou past
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Vraag {step + 1} van {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{currentQuestion.title}</h2>
        <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => {
          const isSelected = answers[currentQuestion.key] === option.value;
          return (
            <button
              key={option.value}
              onClick={() => selectAnswer(option.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">{option.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-blue-600 ml-auto" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={goBack}
          disabled={step === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            step === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Vorige
        </button>

        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 self-center">
          Annuleren
        </Link>
      </div>
    </div>
  );
}
