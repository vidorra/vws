import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'wasstrip-nl',
    name: 'Wasstrip.nl',
    supplier: 'Wasstrip.nl',
    description: 'Milieuvriendelijke vaatwasstrips met natuurlijke ingrediënten',
    longDescription: 'Wasstrip.nl biedt een betaalbaar alternatief voor traditionele vaatwastabletten. Hun strips zijn volledig biologisch afbreekbaar en verpakt in karton.',
    currentPrice: 12.80,
    pricePerWash: 0.16,
    washesPerPack: 80,
    rating: 4.2,
    reviewCount: 234,
    inStock: true,
    sustainability: 8.8,
    availability: 'Online only',
    features: ['Hypoallergeen', 'Koud & warm water', 'Biologisch afbreekbaar'],
    pros: ['Laagste prijs', 'Grote verpakkingen'],
    cons: ['Minder bekende merk', 'Beperkte reviews'],
    url: 'https://wasstrip.nl',
  },
  {
    slug: 'mothers-earth',
    name: "Mother's Earth",
    supplier: "Mother's Earth",
    description: 'Nederlandse kwaliteit met focus op duurzaamheid',
    longDescription: "Mother's Earth is een van de eerste merken die wasstrips introduceerde in Nederland. Met een sterke focus op duurzaamheid en natuurlijke ingrediënten.",
    currentPrice: 10.20,
    pricePerWash: 0.17,
    washesPerPack: 60,
    rating: 4.6,
    reviewCount: 1247,
    inStock: true,
    sustainability: 9.2,
    availability: 'Online only',
    features: ['Plantaardig', '30 dagen garantie', 'Doneert aan goede doelen'],
    pros: ['Goedkoop per wasbeurt', 'Biologisch afbreekbaar'],
    cons: ['Lange levertijd (5-9 dagen)', 'Verzending vanuit China'],
    url: 'https://mothersearth.nl',
  },
  {
    slug: 'bubblyfy',
    name: 'Bubblyfy',
    supplier: 'Bubblyfy',
    description: 'Moderne vaatwasstrips met frisse geuren',
    longDescription: 'Bubblyfy richt zich op de moderne consument die waarde hecht aan zowel effectiviteit als beleving.',
    currentPrice: 14.08,
    pricePerWash: 0.22,
    washesPerPack: 64,
    rating: 4.4,
    reviewCount: 456,
    inStock: true,
    sustainability: 9.0,
    availability: 'Online only',
    features: ['100% natuurlijk', 'Enzymen uit planten', 'Geld-terug garantie'],
    pros: ['Natuurlijke ingrediënten', 'Innovatieve formule'],
    cons: ['Beperkte beschikbaarheid', 'Relatief nieuw merk'],
    url: 'https://bubblyfy.com',
  },
  {
    slug: 'cosmeau',
    name: 'Cosmeau',
    supplier: 'Cosmeau',
    description: 'Premium biologische vaatwasstrips',
    longDescription: 'Cosmeau is een Nederlands merk dat zich richt op het maken van duurzame wasproducten zonder concessies te doen aan kwaliteit.',
    currentPrice: 15.00,
    pricePerWash: 0.25,
    washesPerPack: 60,
    rating: 4.3,
    reviewCount: 892,
    inStock: true,
    sustainability: 8.5,
    availability: 'Online + Winkels',
    features: ['Anti-bacterieel', 'Enzyme formule', 'Vrij van parabenen'],
    pros: ['Snelle levering', 'Breed verkrijgbaar'],
    cons: ['Hoger prijspunt', 'Schuimvorming bij kleine vaatwassers'],
    url: 'https://cosmeau.nl',
  },
  {
    slug: 'bio-suds',
    name: 'Bio-Suds',
    supplier: 'Bio-Suds',
    description: 'Premium biologische vaatwasstrips',
    longDescription: 'Bio Suds is het premium biologische alternatief in de wasstrips markt. Met 100% natuurlijke en biologische ingrediënten.',
    currentPrice: 17.40,
    pricePerWash: 0.29,
    washesPerPack: 60,
    rating: 4.1,
    reviewCount: 189,
    inStock: false,
    sustainability: 8.7,
    availability: 'Online + Bol.com',
    features: ['Fosfaatvrij', 'Chloorvrij', 'Premium formule'],
    pros: ['Premium kwaliteit', 'Milieuvriendelijke verpakking'],
    cons: ['Duurste optie', 'Kleinere community'],
    url: 'https://bio-suds.com',
  },
  {
    slug: 'natuwash',
    name: 'Natuwash',
    supplier: 'NATUWASH',
    description: 'OECD 301B gecertificeerde biologisch afbreekbare vaatwasstrips',
    longDescription: 'Nederlands bedrijf dat technologie en natuur combineert voor duurzame wasoplossingen. Als enige merk met OECD 301B certificering biedt Natuwash de hoogste standaard in biologische afbreekbaarheid.',
    currentPrice: 16.95, // Estimated price
    pricePerWash: 0.28, // Estimated based on 60 washes
    washesPerPack: 60,
    rating: 4.2,
    reviewCount: 156,
    inStock: true,
    sustainability: 9.2,
    availability: 'Online only',
    features: [
      'OECD 301B Gecertificeerd',
      'Hypoallergeen',
      'Plastic-vrije verpakking',
      'Fosfaatvrij',
      '30 dagen geld-terug-garantie'
    ],
    pros: [
      'Enige merk met OECD 301B certificering',
      'Hypoallergene varianten beschikbaar',
      'Nederlandse bedrijfsvoering',
      '30 dagen proefperiode'
    ],
    cons: [
      'Beperkte online aanwezigheid',
      'Onduidelijke prijsstelling',
      'Kleinere bekendheid'
    ],
    url: 'https://natuwash.com/products/vaatwasstrips',
  },
  {
    slug: 'greengoods',
    name: 'GreenGoods',
    supplier: 'GREENGOODS',
    description: 'Eco-vriendelijke vaatwasstrips met flexibel doseringssysteem',
    longDescription: 'Nederlands merk gericht op eco-vriendelijke huishoudproducten met scheur-in-tweeën doseringssysteem. Perfect voor beginners met betaalbare proefpakketten.',
    currentPrice: 34.95,
    pricePerWash: 0.29,
    washesPerPack: 120,
    rating: 4.0,
    reviewCount: 89,
    inStock: true,
    sustainability: 8.5,
    availability: 'Bol.com',
    features: [
      '100% plastic-vrij',
      'Biologisch afbreekbaar',
      'Scheur-in-tweeën dosering',
      'Verkrijgbaar via Bol.com',
      'Proefpakketten beschikbaar'
    ],
    pros: [
      'Flexibele dosering mogelijk',
      'Verkrijgbaar via Bol.com',
      'Betaalbare proefpakketten',
      'Goed voor beginners'
    ],
    cons: [
      'Geen eigen website',
      'Beperkte productinformatie',
      'Kleinere verpakkingen',
      'Minder premium positionering'
    ],
    url: 'https://www.bol.com/nl/s/?searchtext=greengoods+vaatwasstrips',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.priceHistory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  
  console.log('🧹 Cleared existing data');

  // Create products
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    
    console.log(`✅ Created product: ${product.name}`);
    
    // Add initial price history
    await prisma.priceHistory.create({
      data: {
        productId: product.id,
        price: product.currentPrice!,
        pricePerWash: product.pricePerWash!,
      },
    });
    
    // Add some mock reviews
    if (product.reviewCount > 0) {
      const reviews = [
        {
          rating: 5,
          title: 'Uitstekende wasstrips!',
          content: 'Ik ben zeer tevreden met deze wasstrips. Ze werken goed en zijn makkelijk in gebruik.',
          userName: 'Anna de Vries',
          verified: true,
        },
        {
          rating: 4,
          title: 'Goed product, maar...',
          content: 'De wasstrips werken prima, maar bij hardnekkige vlekken moet je soms twee strips gebruiken.',
          userName: 'Peter Jansen',
          verified: true,
        },
        {
          rating: 4,
          title: 'Milieuvriendelijk alternatief',
          content: 'Fijn dat er een duurzaam alternatief is voor traditionele vaatwastabletten.',
          userName: 'Lisa Bakker',
          verified: false,
        },
      ];
      
      for (const review of reviews.slice(0, Math.min(3, product.reviewCount))) {
        await prisma.review.create({
          data: {
            ...review,
            productId: product.id,
          },
        });
      }
    }
  }
  
  // Create admin user
  const bcrypt = await import('bcryptjs');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  
  await prisma.adminUser.create({
    data: {
      email: 'admin@vaatwasstripsvergelijker.nl',
      passwordHash: adminPasswordHash,
      name: 'Admin User',
    },
  });
  
  console.log('✅ Created admin user');
  
  // Add some site settings
  const settings = [
    { key: 'site_name', value: 'Vaatwasstrips Vergelijker', description: 'Site name' },
    { key: 'site_description', value: 'Vergelijk vaatwasstrips van alle Nederlandse aanbieders', description: 'Site description' },
    { key: 'contact_email', value: 'info@vaatwasstripsvergelijker.nl', description: 'Contact email' },
  ];
  
  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }
  
  console.log('✅ Created site settings');
  console.log('🎉 Database seed completed!');
}

// Export for use in API routes
export { main };

// Run if called directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}