import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'cosmeau-wasstrips',
    name: 'Cosmeau Wasstrips',
    supplier: 'Cosmeau',
    description: 'Nederlandse wasstrips met meerdere geurvarianten, dermatologisch getest',
    longDescription: `Cosmeau is een Nederlands merk dat zich richt op duurzame wasproducten. Hun wasstrips zijn ontwikkeld in samenwerking met Nederlandse universiteiten en zijn het meest verkochte wasstrip-merk op Bol.com en Amazon.de.

De wasstrips zijn dermatologisch getest en beschikbaar in 6 verschillende geuren. De G5-formule bevat 5 krachtige enzymen die vlekken en verkleuring aanpakken. Met verpakkingen van 20 tot 360 wasbeurten is er voor elk huishouden een passende optie.

Cosmeau combineert effectiviteit met duurzaamheid: de strips zijn plasticvrij verpakt, veganistisch en grotendeels biologisch afbreekbaar. Extra wasverzachter is niet nodig — de strips maken je was zachter dan traditioneel wasmiddel.`,
    currentPrice: 8.95,
    pricePerWash: 0.149,
    washesPerPack: 60,
    rating: 4.3,
    reviewCount: 1850,
    inStock: true,
    sustainability: 8.5,
    availability: 'Online + retail',
    features: ['Dermatologisch getest', '6 geurvarianten', 'G5 formule met 5 enzymen', 'Plasticvrije verpakking', 'Effectief vanaf 15°C', 'Biologisch afbreekbaar'],
    pros: ['Meest verkochte merk op Bol.com', 'Breed verkrijgbaar via meerdere retailers', 'Dermatologisch getest voor gevoelige huid', '6 geurvarianten beschikbaar', 'Nederlandse productontwikkeling'],
    cons: ['Productie deels in China', 'Geur verdwijnt relatief snel na het drogen', 'Verpakking niet volledig composteerbaar', 'Kan schuimen bij overdosering', 'Minder effectief bij hardnekkige vlekken op 30°C'],
    url: 'https://cosmeau.com/products/wasstrips',
    displayOrder: 10,
  },
  {
    slug: 'mothers-earth-wasstrips',
    name: "Mother's Earth Wasstrips",
    supplier: "Mother's Earth",
    description: 'Populairste wasstrip-merk met 1200+ reviews en microplastic-vrije formule',
    longDescription: `Mother's Earth is een van de pioniers op de Nederlandse wasstrips markt. Het merk positioneert zichzelf als #1 in wasstrips en heeft de grootste reviewbasis met meer dan 1.200 geverifieerde beoordelingen.

De wasstrips bevatten gezondere ingrediënten en zijn volledig microplastic-vrij. Productie en verzending vindt plaats vanuit het eigen magazijn in Dordrecht, wat snelle levering (volgende dag bij bestelling voor 22:00) en lagere CO2-uitstoot garandeert.

Mother's Earth biedt een 30 dagen proefperiode aan — niet tevreden, geld terug. Bij elke aankoop worden 10 strips gedoneerd aan een partnerorganisatie. Beschikbaar in pakketten van 60, 180 en 360 wasbeurten.`,
    currentPrice: 10.20,
    pricePerWash: 0.17,
    washesPerPack: 60,
    rating: 4.6,
    reviewCount: 1280,
    inStock: true,
    sustainability: 8.0,
    availability: 'Online only',
    features: ['Microplastic-vrij', 'Verzending vanuit Dordrecht', '30 dagen proefperiode', '100% plasticvrije verpakking', 'Veganistisch en dierproefvrij', 'Effectief vanaf 20°C'],
    pros: ['Grootste reviewbasis (1.200+ reviews)', 'Verzending vanuit Nederland (Dordrecht)', '30 dagen niet-goed-geld-terug garantie', 'Microplastic-vrije formule', 'Sociaal verantwoord: 10 strips gedoneerd per aankoop'],
    cons: ['Hogere prijs per wasbeurt dan sommige concurrenten', 'Beperkte geurkeuze', 'Niet verkrijgbaar in fysieke winkels', 'Minder effectief bij zware vetvlekken', 'Verzendkosten bij kleine bestellingen'],
    url: 'https://nl.mothersearth.com/products/milieuvriendelijke-wasvellen-60',
    displayOrder: 20,
  },
  {
    slug: 'natuwash-wasstrips',
    name: 'Natuwash Wasstrips',
    supplier: 'Natuwash',
    description: 'OECD 301B gecertificeerde wasstrips met plantaardige enzymen',
    longDescription: `Natuwash combineert technologie en natuur voor duurzame wasoplossingen. Als enige merk met OECD 301B certificering biedt Natuwash de hoogste standaard in biologische afbreekbaarheid voor hun wasstrips.

De wasstrips bevatten een plantaardig reinigingsenzym dat zelfs de hardnekkigste vlekken aanpakt. Ze lossen volledig op en laten geen residu achter op kleding. De strips zijn geschikt voor alle wasmachines, inclusief high-efficiency machines.

Natuwash biedt ook hypoallergene varianten aan en een 30 dagen proefperiode. De verpakking is volledig gerecycled en recyclebaar, wat het totaalplaatje qua duurzaamheid compleet maakt.`,
    currentPrice: 16.95,
    pricePerWash: 0.28,
    washesPerPack: 60,
    rating: 4.2,
    reviewCount: 340,
    inStock: true,
    sustainability: 9.4,
    availability: 'Online only',
    features: ['OECD 301B gecertificeerd biologisch afbreekbaar', 'Plantaardig reinigingsenzym', 'Hypoallergene variant beschikbaar', 'Gerecyclede en recyclebare verpakking', 'Fosfaatvrij en chloorvrij', 'Effectief vanaf 20°C'],
    pros: ['Enige merk met OECD 301B certificering', 'Hypoallergene varianten voor gevoelige huid', 'Nederlandse bedrijfsvoering met lokale klantenservice', '30 dagen niet-goed-geld-terug garantie', 'Hoogste duurzaamheidsscore'],
    cons: ['Hoogste prijs per wasbeurt in de vergelijking', 'Beperkte online aanwezigheid', 'Kleiner merk met minder naamsbekendheid', 'Beperkt aantal geurvarianten', 'Levertijd kan oplopen bij drukte'],
    url: 'https://natuwash.com/products/wasstrips',
    displayOrder: 30,
  },
  {
    slug: 'bio-suds-wasstrips',
    name: 'Bio-Suds Wasstrips',
    supplier: 'Bio-Suds',
    description: 'EcoCert gecertificeerde biologische wasstrips met 100 dagen garantie',
    longDescription: `Bio-Suds positioneert zich als het premium biologische alternatief in de wasstrips markt. Met EcoCert-certificering en 100% natuurlijke ingrediënten is dit de keuze voor consumenten die geen compromissen willen sluiten op duurzaamheid.

De wasstrips combineren reiniging en verzachting in één product, zodat je was zacht aanvoelt zonder extra wasverzachter. Ze lossen volledig op bij temperaturen vanaf 15°C tot 60°C en zijn geschikt voor zowel voorladers als bovenladers.

Bio-Suds biedt een opvallend ruime 100 dagen geld-terug-garantie. De composteerbare verpakking en transparante ingrediëntenlijst completeren het premium verhaal. Verzending vanuit eigen magazijn in Nederland.`,
    currentPrice: 17.40,
    pricePerWash: 0.29,
    washesPerPack: 60,
    rating: 4.1,
    reviewCount: 420,
    inStock: true,
    sustainability: 9.2,
    availability: 'Online + Bol.com',
    features: ['EcoCert gecertificeerd', '100% plantaardige ingrediënten', 'Composteerbare verpakking', 'Vrij van synthetische geurstoffen', 'Fosfaatvrij en chloorvrij', 'Effectief vanaf 15°C'],
    pros: ['EcoCert gecertificeerd met 100% biologische ingrediënten', '100 dagen geld-terug-garantie', 'Volledig composteerbare verpakking', 'Transparante ingrediëntenlijst', 'Geen synthetische geuren of kleurstoffen'],
    cons: ['Hogere prijs per wasbeurt', 'Minder effectief bij hardnekkige vetvlekken', 'Beperkte beschikbaarheid in fysieke winkels', 'Kleine community en weinig Nederlandse reviews', 'Geen grote voordeelverpakkingen'],
    url: 'https://www.bio-suds.com/products/bio-suds-biologische-wasstrips',
    displayOrder: 40,
  },
  {
    slug: 'wasstrip-nl-wasstrips',
    name: 'Wasstrip.nl Wasstrips',
    supplier: 'Wasstrip.nl',
    description: 'Meest betaalbare wasstrips in Nederland, ideaal voor grote gezinnen',
    longDescription: `Wasstrip.nl is ontstaan vanuit de overtuiging dat duurzaam wassen voor iedereen betaalbaar moet zijn. Als goedkoopste optie in de markt bieden ze wasstrips vanaf €0,16 per wasbeurt — ideaal voor grote gezinnen en prijsbewuste consumenten.

De wasstrips werken als een alles-in-één oplossing: plantaardig wasverzachter, vlekkenverwijderaar en wasmiddel in één strip. Ze lossen volledig op tijdens de wasbeurt, zijn geschikt voor alle temperaturen en wasmachines, en werken veilig op alle kleuren.

De verpakking is plasticvrij en duurzaam. Wasstrip.nl levert vanuit Nederland en biedt grote voordeelverpakkingen aan waarmee de prijs per wasbeurt nog verder daalt.`,
    currentPrice: 12.80,
    pricePerWash: 0.16,
    washesPerPack: 80,
    rating: 4.2,
    reviewCount: 560,
    inStock: true,
    sustainability: 8.8,
    availability: 'Online only',
    features: ['Alles-in-één formule', 'Plasticvrije verpakking', 'Geschikt voor alle temperaturen', 'Geschikt voor alle wasmachines', 'Voordeelverpakkingen beschikbaar', 'Nederlandse klantenservice'],
    pros: ['Laagste prijs per wasbeurt in de vergelijking', 'Grote voordeelverpakkingen beschikbaar', 'Alles-in-één: wasmiddel + verzachter + vlekkenverwijderaar', 'Plasticvrije verpakking', 'Eenvoudig in gebruik, ideaal voor beginners'],
    cons: ['Minder bekende merknaam', 'Beperkt aantal onafhankelijke reviews', 'Geen certificeringen van externe partijen', 'Minder effectief bij hardnekkige vlekken', 'Beperkte geurkeuze'],
    url: 'https://wasstrip.nl/c/producten/',
    displayOrder: 50,
  },
  {
    slug: 'happysoaps-wasstrips',
    name: 'HappySoaps Wasstrips',
    supplier: 'HappySoaps',
    description: 'Zweedse productie, apart voor witte en gekleurde was',
    longDescription: `HappySoaps is een Nederlands merk dat hun wasstrips (Laundry Sheets) laat produceren in Zweden. Dit maakt hen uniek in de markt — Europese productie staat garant voor strenge kwaliteitscontroles en lagere transportemissies dan Aziatische alternatieven.

Een onderscheidend kenmerk is dat HappySoaps aparte varianten aanbiedt voor witte en gekleurde was. De variant voor witte was bevat optische witmakers die witte kleding helder houden, terwijl de variant voor gekleurde was kleurvervaging tegengaat.

De strips zijn 100% plasticvrij verpakt, veganistisch en dierproefvrij. Met een pakje van 35 wasbeurten zijn ze compacter dan de meeste concurrenten. Beschikbaar via de eigen webshop, Bol.com en drogisterijen.`,
    currentPrice: 8.95,
    pricePerWash: 0.256,
    washesPerPack: 35,
    rating: 4.0,
    reviewCount: 380,
    inStock: true,
    sustainability: 8.7,
    availability: 'Online + drogisterijen',
    features: ['Geproduceerd in Zweden (EU)', 'Aparte variant voor witte en gekleurde was', '100% plasticvrije verpakking', 'Veganistisch en dierproefvrij', 'Volledig oplosbaar zonder residu', 'Gratis verzending vanaf €25'],
    pros: ['Europese productie (Zweden) met strenge kwaliteitscontroles', 'Aparte formule voor witte en gekleurde was', 'Breed verkrijgbaar (webshop, Bol.com, drogisterijen)', '100% plasticvrij en veganistisch', 'Compact formaat ideaal voor reizen'],
    cons: ['Kleiner pakket (35 wasbeurten) dan concurrenten', 'Hogere prijs per wasbeurt', 'Minder variatie in pakketgroottes', 'Beperkt aantal geurvarianten', 'Niet de laagste prijs in het segment'],
    url: 'https://nl.happysoaps.com/products/laundry-sheets-gekleurde-witte-was-35-stuks',
    displayOrder: 60,
  },
];

async function main() {
  console.log('🧺 Seeding wasstrips products...');

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });

    if (existing) {
      await prisma.product.update({
        where: { slug: product.slug },
        data: { ...product, site: 'wasstrips' },
      });
      console.log(`  Updated: ${product.slug}`);
    } else {
      await prisma.product.create({
        data: { ...product, site: 'wasstrips' },
      });
      console.log(`  Created: ${product.slug}`);
    }

    // Add initial price history
    const p = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (p) {
      const historyExists = await prisma.priceHistory.findFirst({
        where: { productId: p.id },
      });
      if (!historyExists) {
        await prisma.priceHistory.create({
          data: {
            productId: p.id,
            price: product.currentPrice,
            pricePerWash: product.pricePerWash,
          },
        });
        console.log(`  Added price history for: ${product.slug}`);
      }
    }

    // Add product variants
    const prod = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (prod) {
      const variantCount = await prisma.productVariant.count({ where: { productId: prod.id } });
      if (variantCount === 0) {
        const variants = getVariantsForProduct(product.slug, product.url);
        for (const variant of variants) {
          await prisma.productVariant.create({
            data: { ...variant, productId: prod.id },
          });
        }
        console.log(`  Added ${variants.length} variants for: ${product.slug}`);
      }
    }
  }

  // Add sample reviews for wasstrips products
  const reviewers = [
    { name: 'Sophie de Groot', rating: 5, title: 'Fantastisch product!', content: 'Werkt perfect in mijn wasmachine, zelfs op 30 graden. Kleding ruikt heerlijk fris.' },
    { name: 'Mark Hendriks', rating: 4, title: 'Goed alternatief', content: 'Fijne strips, lossen goed op. Bij zware vlekken doe ik er wel twee in.' },
    { name: 'Eva Willems', rating: 4, title: 'Handig op reis', content: 'Neem ze altijd mee op vakantie. Geen gedoe met vloeistoffen bij de security!' },
  ];

  for (const product of products) {
    const p = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (p) {
      const reviewCount = await prisma.review.count({ where: { productId: p.id } });
      if (reviewCount === 0) {
        for (const reviewer of reviewers) {
          await prisma.review.create({
            data: {
              productId: p.id,
              rating: reviewer.rating,
              title: reviewer.title,
              content: reviewer.content,
              userName: reviewer.name,
              verified: true,
            },
          });
        }
        console.log(`  Added reviews for: ${product.slug}`);
      }
    }
  }

  console.log('✅ Done! Wasstrips products seeded.');
}

function getVariantsForProduct(slug: string, baseUrl: string) {
  const variantMap: Record<string, Array<{ name: string; washCount: number; price: number; pricePerWash: number; isDefault: boolean }>> = {
    'cosmeau-wasstrips': [
      { name: '20 wasbeurten', washCount: 20, price: 8.95, pricePerWash: 0.448, isDefault: false },
      { name: '60 wasbeurten', washCount: 60, price: 14.95, pricePerWash: 0.249, isDefault: true },
      { name: '120 wasbeurten', washCount: 120, price: 24.95, pricePerWash: 0.208, isDefault: false },
      { name: '360 wasbeurten', washCount: 360, price: 59.95, pricePerWash: 0.166, isDefault: false },
    ],
    'mothers-earth-wasstrips': [
      { name: '60 wasbeurten', washCount: 60, price: 10.20, pricePerWash: 0.17, isDefault: true },
      { name: '180 wasbeurten', washCount: 180, price: 27.00, pricePerWash: 0.15, isDefault: false },
      { name: '360 wasbeurten', washCount: 360, price: 48.00, pricePerWash: 0.133, isDefault: false },
    ],
    'natuwash-wasstrips': [
      { name: '30 wasbeurten', washCount: 30, price: 9.95, pricePerWash: 0.332, isDefault: false },
      { name: '60 wasbeurten', washCount: 60, price: 16.95, pricePerWash: 0.283, isDefault: true },
      { name: '120 wasbeurten', washCount: 120, price: 29.95, pricePerWash: 0.25, isDefault: false },
    ],
    'bio-suds-wasstrips': [
      { name: '10 wasbeurten (proefpakket)', washCount: 10, price: 3.95, pricePerWash: 0.395, isDefault: false },
      { name: '30 wasbeurten', washCount: 30, price: 9.95, pricePerWash: 0.332, isDefault: false },
      { name: '60 wasbeurten', washCount: 60, price: 17.40, pricePerWash: 0.29, isDefault: true },
      { name: '120 wasbeurten', washCount: 120, price: 29.95, pricePerWash: 0.25, isDefault: false },
    ],
    'wasstrip-nl-wasstrips': [
      { name: '40 wasbeurten', washCount: 40, price: 7.49, pricePerWash: 0.187, isDefault: false },
      { name: '80 wasbeurten', washCount: 80, price: 12.80, pricePerWash: 0.16, isDefault: true },
      { name: '120 wasbeurten', washCount: 120, price: 17.99, pricePerWash: 0.15, isDefault: false },
    ],
    'happysoaps-wasstrips': [
      { name: '35 wasbeurten (Gekleurde Was)', washCount: 35, price: 8.95, pricePerWash: 0.256, isDefault: true },
      { name: '35 wasbeurten (Witte Was)', washCount: 35, price: 8.95, pricePerWash: 0.256, isDefault: false },
      { name: '105 wasbeurten (Kwartaalbox)', washCount: 105, price: 22.95, pricePerWash: 0.219, isDefault: false },
    ],
  };

  const variants = variantMap[slug] || [];
  return variants.map((v) => ({
    name: v.name,
    washCount: v.washCount,
    price: v.price,
    pricePerWash: v.pricePerWash,
    currency: 'EUR',
    inStock: true,
    isDefault: v.isDefault,
    url: baseUrl,
  }));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
