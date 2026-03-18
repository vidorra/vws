import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { getSite } from '@/lib/get-site';

type Section = {
  heading: string;
  body: string;
  list?: string[];
  tip?: string;
  table?: { headers: string[]; rows: string[][] };
};

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  intro: string;
  sections: Section[];
  cta: { heading: string; text: string; href: string; label: string };
  related: { slug: string; title: string }[];
};

const posts: BlogPost[] = [
  {
    slug: 'wasstrips-vs-wasmiddel',
    title: 'Wasstrips vs Traditioneel Wasmiddel: De Ultieme Vergelijking',
    excerpt:
      'Een diepgaande vergelijking tussen wasstrips en traditioneel wasmiddel. Ontdek de voor- en nadelen van beide opties.',
    author: 'Redactie',
    date: '2024-06-15',
    readTime: '8 min',
    category: 'Vergelijking',
    intro:
      'Wasstrips zijn de laatste jaren sterk in opmars. Maar zijn ze werkelijk beter dan het traditionele vloeibare wasmiddel of waspoeder dat al decennia in onze wastrommel belandt? We vergeleken de twee op de vijf factoren die er echt toe doen: wasresultaat, kosten, milieu-impact, gebruiksgemak en geschiktheid voor jouw situatie.',
    sections: [
      {
        heading: '1. Wasresultaat: zijn wasstrips even effectief?',
        body: 'Kort antwoord: ja, voor de meeste dagelijkse was. Wasstrips bevatten geconcentreerde tensiden die vlekken op moleculair niveau lostrekken — dezelfde werking als vloeibaar wasmiddel. Het verschil zit in de hoeveelheid actieve stof per wasbeurt.',
        list: [
          'Normaal bevuilde was (t-shirts, ondergoed, handdoeken): wasstrips presteren gelijkwaardig',
          'Hardnekkige vlekken (vet, modder, gras): vloeibaar wasmiddel heeft een licht voordeel bij 60°C',
          'Witte was: waspoeder met bleekwerking is iets effectiever voor het witter houden',
          'Gevoelige kleding (wol, zijde): wasstrips zijn zacht — vergelijkbaar met een fijnwasprogramma',
        ],
      },
      {
        heading: '2. Kosten per wasbeurt',
        body: 'Prijs per wasbeurt is de eerlijkste maatstaf. Let op dat sommige merken 1,5–2 strips aanbevelen voor een volle trommel.',
        table: {
          headers: ['Product', 'Prijs per wasbeurt', 'Opmerkingen'],
          rows: [
            ['Budget wasstrips', '€0,18 – €0,22', 'Laagste instapkosten'],
            ['Premium wasstrips', '€0,28 – €0,40', 'Biologisch, gevoelige huid'],
            ['Vloeibaar wasmiddel (huismerk)', '€0,12 – €0,18', 'Goedkoopste optie'],
            ['Vloeibaar wasmiddel (A-merk)', '€0,25 – €0,45', 'Duurste reguliere optie'],
            ['Waspoeder (A-merk)', '€0,14 – €0,22', 'Goede prijs-kwaliteit'],
          ],
        },
      },
      {
        heading: '3. Milieu-impact',
        body: 'Hier wint wasstrips overduidelijk. Vloeibaar wasmiddel bestaat voor 80–90% uit water dat je meebetaalt en meevervoert. Wasstrips bevatten geen water, wegen 94% minder per wasbeurt en komen in een kartonnen doosje zonder plastic.',
        list: [
          'Verpakking: karton vs. plastic fles',
          'Transport CO2: wasstrips tot 87% minder transportemissies',
          'Biologische afbreekbaarheid: afhankelijk van merk, maar top-merken zijn volledig afbreekbaar',
          'Watergebruik: wasstrips beïnvloeden het waswater niet — geen verschil',
        ],
        tip: 'Bonus: wasstrips werken effectief bij 30°C, wat nog eens 40–60% energie scheelt ten opzichte van wassen op 60°C.',
      },
      {
        heading: '4. Gebruiksgemak',
        body: 'Wasstrips zijn simpel: je pakt er één uit het doosje en gooit hem direct op de was. Geen meten, geen morsen, geen vuile dop. Ideaal voor mensen die het wassen graag snel willen afronden — of voor op reis.',
        list: [
          'Voordosering: altijd de juiste hoeveelheid, nooit over- of onderdosering',
          'Opslag: past in elke lade, neemt 94% minder ruimte in',
          'Reizen: neem een paar strips mee in een zakje — geen gelprobleem bij de beveiliging',
          'Nadeel: bij hardnekkige vlekken moet je zelf voor-behandelen (strip op de vlek wrijven)',
        ],
      },
      {
        heading: '5. Conclusie: wat kies je?',
        body: 'Wasstrips zijn de slimmere keuze voor de meeste huishoudens — zeker als milieu en gemak zwaar wegen. Voor wie maximale vlekverwijdering bij hoge temperaturen nodig heeft, of voor een heel scherpe prijs wil wassen, is vloeibaar wasmiddel of poeder nog steeds relevant.',
      },
    ],
    cta: {
      heading: 'Welke wasstrip past bij jou?',
      text: 'Vergelijk alle merken op prijs, duurzaamheid en wasresultaten',
      href: '/vergelijk',
      label: 'Start vergelijking',
    },
    related: [
      { slug: 'duurzaam-wassen', title: 'Duurzaam Wassen: 10 Tips om Milieuvriendelijk te Wassen' },
      {
        slug: 'besparen-wasmiddel',
        title: 'Zo Bespaar je tot €150 per Jaar op Wasmiddel',
      },
    ],
  },
  {
    slug: 'duurzaam-wassen',
    title: 'Duurzaam Wassen: 10 Tips om Milieuvriendelijk te Wassen',
    excerpt:
      'Praktische tips om je wasroutine duurzamer te maken. Van temperatuur tot dosering, alles wat je moet weten.',
    author: 'Lisa van den Berg',
    date: '2024-06-10',
    readTime: '6 min',
    category: 'Duurzaamheid',
    intro:
      'De wasmachine is goed voor zo\'n 8% van het totale huishoudelijke energieverbruik. Samen met de waterrekening en de impact van wasmiddel op het oppervlaktewater is wassen een van de meest impactvolle dagelijkse gewoontes. Gelukkig kun je met een paar aanpassingen je ecologische voetafdruk significant verkleinen — zonder in te leveren op schone was.',
    sections: [
      {
        heading: 'Tip 1–3: Temperatuur en programma',
        body: 'De meeste energie gaat zitten in het opwarmen van water. Dit zijn de drie grootste energiewinsten:',
        list: [
          'Was op 30°C of koud: wasstrips en moderne wasmiddelen werken even effectief bij lage temperaturen. Je bespaart tot 60% energie ten opzichte van 60°C.',
          'Gebruik het eco-programma: duurt langer, maar gebruikt 30–40% minder energie doordat de machine slimmer werkt met lager water.',
          'Vermijd de droger: een droger verbruikt meer elektriciteit dan de wasmachine. Luchten op een rek scheelt jaarlijks €100–€150 aan energiekosten.',
        ],
      },
      {
        heading: 'Tip 4–6: Vulling en dosering',
        body: 'Hoe je de trommel vult en doseert maakt een groter verschil dan je denkt:',
        list: [
          'Volle trommel: was altijd een volle (maar niet overvulle) trommel. Twee halve trommels verbruiken dubbel zoveel energie en water.',
          'Gebruik niet te veel wasmiddel: overdosering beschadigt je machine, vervuilt het water en schoont niet beter. Wasstrips zijn altijd perfect voorgedoseerd.',
          'Voorwas weglaten: de voorwas is in de meeste gevallen overbodig. Schakel hem uit en bespaar 10–15 minuten en extra water.',
        ],
      },
      {
        heading: 'Tip 7–8: Keuze van wasmiddel',
        body: 'Het merk en type wasmiddel bepalen voor een groot deel de milieu-impact:',
        list: [
          'Kies wasstrips boven vloeibaar wasmiddel: 94% lichter transport, kartonnen verpakking in plaats van plastic, en plantaardige tensiden die volledig afbreken.',
          'Let op certificeringen: EcoCert, EU Ecolabel en OECD 301B zijn objectieve garanties dat de ingrediënten veilig zijn voor waterorganismen.',
        ],
        tip: 'Gebruik de duurzaamheidsscore op onze vergelijkingspagina om direct te zien welk merk het beste scoort.',
      },
      {
        heading: 'Tip 9–10: Onderhoud en aankoop',
        body: 'Een schone machine wast efficiënter:',
        list: [
          'Maandelijks trommel reinigen: spoelen op 60°C met soda of een reinigingstablet verwijdert kalkafzetting en bacteriën die de machine minder efficiënt maken.',
          'Koop energie-efficiënte machines: bij vervanging, kies voor A+++ labels. De jaarlijkse besparing loopt op tot €70 per jaar vergeleken met een B-label machine.',
        ],
      },
    ],
    cta: {
      heading: 'De meest duurzame wasstrip kiezen?',
      text: 'Bekijk onze duurzaamheidsscores en vergelijk alle merken',
      href: '/overzicht',
      label: 'Bekijk duurzaamheidsscores',
    },
    related: [
      {
        slug: 'wasstrips-vs-wasmiddel',
        title: 'Wasstrips vs Traditioneel Wasmiddel: De Ultieme Vergelijking',
      },
      { slug: 'besparen-wasmiddel', title: 'Zo Bespaar je tot €150 per Jaar op Wasmiddel' },
    ],
  },
  {
    slug: 'besparen-wasmiddel',
    title: 'Zo Bespaar je tot €150 per Jaar op Wasmiddel',
    excerpt:
      'Slimme tips om geld te besparen op je waskosten zonder in te leveren op schone was.',
    author: 'Mark Jansen',
    date: '2024-06-05',
    readTime: '5 min',
    category: 'Besparen',
    intro:
      'Een gemiddeld Nederlands huishouden geeft €180–€250 per jaar uit aan wasmiddel. Met een paar slimme keuzes kun je dat bedrag met meer dan de helft terugdringen — zonder te bezuinigen op wasresultaten. We zetten de zeven beste strategieën op een rij.',
    sections: [
      {
        heading: 'Strategie 1: Stap over op wasstrips in bulk',
        body: 'Dit is de grootste enkelvoudige besparing. Een bulk-pakket wasstrips (120 strips) kost gemiddeld €19,99 — dat is €0,17 per wasbeurt. Een standaard fles vloeibaar A-merk wasmiddel kost €0,35–€0,45 per wasbeurt. Bij 260 wasbeurten per jaar scheelt dat:',
        list: [
          'A-merk vloeistof: 260 × €0,40 = €104/jaar',
          'Bulk wasstrips: 260 × €0,17 = €44/jaar',
          'Besparing: €60/jaar — alleen al door over te stappen',
        ],
      },
      {
        heading: 'Strategie 2: Was altijd op 30°C',
        body: 'Energiekosten zijn onderdeel van je totale waskosten. Wassen op 60°C verbruikt ruim drie keer zoveel stroom als 30°C. Met een gemiddelde stroombehoefte van 0,7 kWh per was op 60°C versus 0,2 kWh op 30°C:',
        list: [
          '260 wasbeurten per jaar × 0,5 kWh besparing = 130 kWh',
          'Bij €0,35/kWh: €45,50 besparing per jaar op energiekosten',
        ],
        tip: 'Gecombineerd met wasstrips zit je al snel op €100+ besparing per jaar.',
      },
      {
        heading: 'Strategie 3: Altijd volle trommel',
        body: 'Een halve trommel waswater kost bijna evenveel als een volle. Door te wachten tot je een volle was hebt, halveer je het aantal beurten — en halveer je de kosten. Praktisch: houd een wastimer bij en was pas als de mand vol is.',
      },
      {
        heading: 'Strategie 4: Vergelijk prijs per wasbeurt, niet per pakket',
        body: 'De meeste mensen vergelijken op winkelprijs. Maar de prijs per wasbeurt kan enorm verschillen. Gebruik onze vergelijkingspagina om direct de prijs per wasbeurt van alle merken naast elkaar te zien.',
      },
      {
        heading: 'Strategie 5: Abonnement met korting',
        body: 'Veel wasstrip-merken bieden 10–15% korting bij een abonnement. Als je al weet dat je een bepaald merk prettig vindt, is een maandelijks abonnement de slimste keuze.',
        list: [
          "Mother's Earth: 12% abonnementskorting",
          'Cosmeau: 10% bij maandelijkse levering',
          'Bio-Suds: 15% op eerste abonnementsbestelling',
        ],
        tip: 'Zet een kalenderherinnering om je abonnement jaarlijks te vergelijken — prijzen veranderen en een ander merk kan inmiddels goedkoper zijn.',
      },
      {
        heading: 'Strategie 6: Droger minder gebruiken',
        body: 'Een droger verbruikt meer stroom dan de wasmachine zelf. Bij 100 droogbeurten per jaar à €0,40 per beurt: €40 besparing als je overstapt op luchtdrogen.',
      },
      {
        heading: 'Strategie 7: Voorwas uitschakelen',
        body: 'Het voorwasprogramma gebruikt extra water en energie. In 95% van de gevallen is het niet nodig. Schakel het uit in de instellingen van je wasmachine en bespaar 15 minuten en extra stroom per wasbeurt.',
      },
    ],
    cta: {
      heading: 'Vind de goedkoopste wasstrip',
      text: 'Vergelijk alle merken op prijs per wasbeurt',
      href: '/prijzen/goedkoopste',
      label: 'Bekijk goedkoopste opties',
    },
    related: [
      {
        slug: 'wasstrips-vs-wasmiddel',
        title: 'Wasstrips vs Traditioneel Wasmiddel: De Ultieme Vergelijking',
      },
      {
        slug: 'duurzaam-wassen',
        title: 'Duurzaam Wassen: 10 Tips om Milieuvriendelijk te Wassen',
      },
    ],
  },
  {
    slug: 'wasstrips-geschiedenis',
    title: 'De Geschiedenis van Wasstrips: Van Innovatie tot Mainstream',
    excerpt:
      'Hoe wasstrips ontstonden en waarom ze nu zo populair zijn. Een kijkje in de ontwikkeling van deze innovatie.',
    author: 'Redactie',
    date: '2024-05-28',
    readTime: '7 min',
    category: 'Achtergrond',
    intro:
      'Wasstrips lijken misschien een recente uitvinding, maar hun oorsprong gaat terug naar de jaren \'90 in Noord-Amerika. De weg van laboratoriumexperiment naar must-have in Nederlandse supermarkten nam enkele decennia — maar de versnelling van de afgelopen vijf jaar is spectaculair.',
    sections: [
      {
        heading: 'De vroege jaren: Canada en de VS (1990–2010)',
        body: 'De eerste wasstrip-achtige producten verschenen eind jaren \'90 bij de Canadese fabrikant Procter & Gamble als experimentele variant op waspoeder. De technologie — geconcentreerd wasmiddel in een wateroplosbare PVA-film — was er al, maar de consument was er nog niet klaar voor.',
        list: [
          '1998: eerste patent op wateroplosbare wasmiddelfilm',
          '2003: kortstondig op de markt in Canada — werd snel teruggetrokken vanwege lage verkopen',
          '2010: hernieuwd interesse door groeiende eco-bewustzijn',
        ],
      },
      {
        heading: 'De doorbraak: eco-bewustzijn als aanjager (2015–2019)',
        body: 'Pas toen duurzaamheid mainstream werd, kreeg de wasstrip een tweede kans. Canadees merk Tru Earth lanceerde in 2018 een direct-to-consumer wasstrip met een sterke milieuboodschap: geen plastic, minder transport, plantaardige ingrediënten. De productlancering ging viraal op social media.',
        tip: 'Tru Earth groeide in twee jaar van 0 naar $20 miljoen omzet — puur via social media en mond-tot-mond.',
      },
      {
        heading: 'Europa en Nederland (2019–heden)',
        body: 'In Nederland kwamen de eerste wasstrip-merken beschikbaar rond 2019. De combinatie van groeiende milieubewustzijn, het verbod op bepaalde microplastics in wasmiddelen en de coronapandemie (meer thuiswassen, interesse in ruimtebesparende producten) gaf de categorie een enorme boost.',
        list: [
          "2019: Mother's Earth en Cosmeau lanceren in Nederland",
          '2020: eerste vermelding in consumentenprogramma\'s als "Kassa"',
          '2021: wasstrips in het assortiment van Albert Heijn en Bol.com',
          '2022–2024: marktaandeel verdrievoudigt; inmiddels 10+ merken actief in NL',
        ],
      },
      {
        heading: 'De toekomst: innovaties in de pijplijn',
        body: 'De wasstrip-industrie staat niet stil. Dit zijn de ontwikkelingen om in de gaten te houden:',
        list: [
          'Koude waterformules: wasstrips die nog effectiever werken bij 20°C of lager',
          'Refill-systemen: herbruikbare blikjes met navulbare strips',
          'Gepersonaliseerde formules: strips afgestemd op watertype of huidtype',
          'Enzymatische wasstrips: voor nog betere vlekverwijdering bij lage temperaturen',
        ],
      },
    ],
    cta: {
      heading: 'Ontdek de nieuwste merken',
      text: 'Bekijk ons complete overzicht van wasstrip-merken in Nederland',
      href: '/merken',
      label: 'Bekijk alle merken',
    },
    related: [
      {
        slug: 'wasstrips-vs-wasmiddel',
        title: 'Wasstrips vs Traditioneel Wasmiddel: De Ultieme Vergelijking',
      },
      {
        slug: 'duurzaam-wassen',
        title: 'Duurzaam Wassen: 10 Tips om Milieuvriendelijk te Wassen',
      },
    ],
  },
  {
    slug: 'vlekken-verwijderen',
    title: 'Vlekken Verwijderen met Wasstrips: Complete Gids',
    excerpt:
      'Van rode wijn tot gras, leer hoe je verschillende vlekken effectief verwijdert met wasstrips.',
    author: 'Sandra de Vries',
    date: '2024-05-20',
    readTime: '10 min',
    category: 'Tips',
    intro:
      'Wasstrips werken uitstekend voor de dagelijkse was, maar bij hardnekkige vlekken moet je een tandje bijzetten. De goede nieuws: wasstrips zijn ook een effectief voorbehandelingsmiddel. In deze gids leggen we per type vlek uit wat de beste aanpak is.',
    sections: [
      {
        heading: 'Hoe werkt vlekverwijdering met wasstrips?',
        body: 'Een wasstrip bevat tensiden — stoffen die vuil lostrekken van vezels door de oppervlaktespanning van water te verlagen. Voor voorbehandeling wrijf je een vochtige strip direct op de droge vlek. Hierdoor concentreer je de actieve stof op de plek die het nodig heeft.',
        tip: 'Maak de strip altijd eerst iets vochtig voordat je hem op de vlek wrijft. Dit activeert de tensiden al voordat de was begint.',
      },
      {
        heading: 'Rode wijn',
        body: 'Een van de meest gevreesde vlekken. Aanpak:',
        list: [
          'Dep direct na het morsen met koud water (nooit warm — dat zet de vlek)',
          'Wrijf een vochtige wasstrip op de vlek en laat 5 minuten intrekken',
          'Was op 30–40°C',
          'Controleer voor drogen — als de vlek er nog in zit, behandel opnieuw (drogen fixeert de vlek)',
        ],
      },
      {
        heading: 'Gras- en aardvlekken',
        body: 'Bijzonder bij grasvlekken is dat chloorhoudende middelen de kleurstof kunnen verspreiden. Aanpak:',
        list: [
          'Verwijder eerst los vuil (kloppen, afschrapen)',
          'Wrijf een vochtige strip op de vlek en laat 10 minuten intrekken',
          'Was op 40°C — grasvlekken hechten sterker bij lagere temperaturen',
        ],
      },
      {
        heading: 'Vetvlekken (koken, fietsketting)',
        body: 'Vet stolt bij koud water. Aanpak:',
        list: [
          'Strooi droog bakpoeder op de vlek en laat 15 minuten staan (absorbeert vet)',
          'Veeg het bakpoeder af',
          'Wrijf een vochtige strip in en laat 5 minuten intrekken',
          'Was op 40°C — de tensiden in de strip breken vet effectief af',
        ],
      },
      {
        heading: 'Zweetvlekken en -geur',
        body: 'Zweetvlekken bestaan uit vetten en eiwitten. Enzymatische wasstrips zijn hiervoor het effectiefst.',
        list: [
          'Week de vlek in koud water met een halve strip gedurende 30 minuten',
          'Was vervolgens op 40°C',
          'Voor hardnekkige geur: voeg een eetlepel baking soda toe aan de was',
        ],
        tip: 'Witte T-shirts met gele zweetvlekken: maak een pasta van baking soda en water, smeer op de vlek, laat 30 min staan en was op 40°C.',
      },
      {
        heading: 'InktVlekken',
        body: 'Inkt is moeilijk te verwijderen. De aanpak verschilt per type inkt:',
        list: [
          'Balpen: behandel met isopropylalcohol, dep daarna de vlek weg, was met strip op 30°C',
          'Stift: wrijf strip direct op de vlek, laat 10 minuten intrekken, was op 30°C',
          'Inktjet-inkt (printer): gelijk koud water, nooit droogmaken — was meteen met strip',
        ],
      },
      {
        heading: 'Wat NIET te doen',
        body: 'Vermijd deze veelgemaakte fouten bij vlekken:',
        list: [
          'Hete was: bij de meeste vlekken fixeert hitte de vlek permanent in de vezel',
          'Droogmaken voor de vlek weg is: de droger is de vijand van vlekken',
          'Wrijven in plaats van deppen: wrijven vergroot de vlek',
          'Bleek op gekleurde was: dit ontkleurt de stof, niet de vlek',
        ],
      },
    ],
    cta: {
      heading: 'Welke wasstrip verwijdert vlekken het beste?',
      text: 'Bekijk onze vergelijking van wasstrips op wasresultaten en vlekverwijdering',
      href: '/vergelijk',
      label: 'Vergelijk wasresultaten',
    },
    related: [
      {
        slug: 'wasstrips-vs-wasmiddel',
        title: 'Wasstrips vs Traditioneel Wasmiddel: De Ultieme Vergelijking',
      },
      {
        slug: 'duurzaam-wassen',
        title: 'Duurzaam Wassen: 10 Tips om Milieuvriendelijk te Wassen',
      },
    ],
  },
];

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const site = getSite();
  const post = posts.find(p => p.slug === params.slug);
  if (!post) return { title: 'Artikel niet gevonden' };

  return {
    title: `${post.title} | ${site.name}`,
    description: post.excerpt,
    keywords: `${post.category.toLowerCase()}, ${site.productNoun}, ${post.slug.replace(/-/g, ', ')}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const site = getSite();
  const post = posts.find(p => p.slug === params.slug);
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": { "@type": "Person", "name": post.author },
    "publisher": { "@type": "Organization", "name": site.name },
    "datePublished": post.date,
    "dateModified": post.date,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": site.canonicalBase },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${site.canonicalBase}/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `${site.canonicalBase}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main article */}
          <article className="lg:col-span-2">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-blue-600">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 line-clamp-1">{post.title}</span>
            </nav>

            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Terug naar blog
            </Link>

            {/* Header */}
            <header className="mb-8">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
                <span>Door {post.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime} leestijd
                </span>
              </div>
            </header>

            {/* Intro */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8 border-l-4 border-blue-200 pl-4">
              {post.intro}
            </p>

            {/* Sections */}
            {post.sections.map((section, i) => (
              <section key={i} className="mb-10">
                <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                {section.body && <p className="text-gray-600 mb-4">{section.body}</p>}

                {section.list && (
                  <ul className="space-y-2 mb-4">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.table && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          {section.table.headers.map(h => (
                            <th key={h} className="text-left p-3 font-semibold border">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, ri) => (
                          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-3 border text-gray-600">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.tip && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-gray-700">
                      <strong>Tip:</strong> {section.tip}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-8 text-center mt-12">
              <h2 className="text-2xl font-bold mb-3">{post.cta.heading}</h2>
              <p className="mb-6">{post.cta.text}</p>
              <Link
                href={post.cta.href}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {post.cta.label}
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Related articles */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Lees ook</h3>
              <ul className="space-y-4">
                {post.related.map(rel => (
                  <li key={rel.slug}>
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium leading-snug block"
                    >
                      → {rel.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="my-6" />

              <h3 className="text-lg font-bold mb-4">Gidsen</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/gids/beginners"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    → Beginners gids wasstrips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gids/milieuvriendelijk"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    → Milieuvriendelijk wassen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gids/kopen-tips"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    → Kopen tips
                  </Link>
                </li>
              </ul>

              <hr className="my-6" />

              <h3 className="text-lg font-bold mb-4">Vergelijken</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/vergelijk" className="text-blue-600 hover:text-blue-800 text-sm">
                    → Vergelijkingstool
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prijzen/goedkoopste"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    → Goedkoopste wasstrips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prijzen/beste-waarde"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    → Beste prijs-kwaliteit
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
