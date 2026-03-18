import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brandContent: Record<string, {
  longDescription: string;
  pros: string[];
  cons: string[];
  features: string[];
}> = {
  'natuwash': {
    longDescription: `Natuwash is een Nederlands bedrijf dat technologie en natuur combineert voor duurzame vaatwasoplossingen. Als enige merk met OECD 301B certificering biedt Natuwash de hoogste standaard in biologische afbreekbaarheid. De vaatwasstrips worden ontwikkeld met een focus op minimale milieu-impact zonder concessies te doen aan reinigingskracht.

Hun productlijn is speciaal ontworpen voor de Nederlandse markt, rekening houdend met het lokale watertype en gangbare vaatwassers. Natuwash biedt ook hypoallergene varianten aan, wat hen geschikt maakt voor huishoudens met gevoelige huid of allergieën. Met een 30 dagen proefperiode laten ze zien dat ze achter hun product staan.`,
    pros: [
      'Enige merk met OECD 301B certificering voor biologische afbreekbaarheid',
      'Hypoallergene varianten beschikbaar voor gevoelige huid',
      'Nederlandse bedrijfsvoering met lokale klantenservice',
      '30 dagen niet-goed-geld-terug garantie',
      'Plasticvrije verpakking van gerecycled karton'
    ],
    cons: [
      'Beperkte online aanwezigheid en marketing',
      'Prijsstelling hoger dan sommige alternatieven',
      'Kleiner merk met minder naamsbekendheid',
      'Beperkt aantal geurvarianten beschikbaar',
      'Levertijd kan oplopen bij drukte'
    ],
    features: [
      'OECD 301B gecertificeerd biologisch afbreekbaar',
      'Geschikt voor alle typen vaatwassers',
      'Hypoallergene variant beschikbaar',
      'Plasticvrije kartonnen verpakking',
      'Fosfaatvrij en chloorvrij',
      'Effectief vanaf 30°C'
    ]
  },
  'wasstrip-nl': {
    longDescription: `Wasstrip.nl is een Nederlands merk dat zich richt op toegankelijkheid en betaalbaarheid in de vaatwasstrips markt. Met de laagste prijs per wasbeurt zijn ze de ideale keuze voor beginners die willen overstappen van traditionele vaatwastabletten naar strips.

Hun vaatwasstrips zijn volledig biologisch afbreekbaar en verpakt in karton, waardoor ze een duurzaam alternatief vormen. Wasstrip.nl biedt grote voordeelverpakkingen aan waarmee de prijs per wasbeurt nog verder daalt. Het merk focust op eenvoud: één product dat goed werkt voor alledaags gebruik.`,
    pros: [
      'Laagste prijs per wasbeurt in de vergelijking',
      'Grote voordeelverpakkingen beschikbaar',
      'Volledig biologisch afbreekbare formule',
      'Kartonnen verpakking zonder plastic',
      'Eenvoudig in gebruik, ideaal voor beginners'
    ],
    cons: [
      'Minder bekende merknaam in de markt',
      'Beperkt aantal onafhankelijke reviews',
      'Geen certificeringen van externe partijen',
      'Minder effectief bij hardnekkige aangekoekte resten',
      'Beperkte geurkeuze'
    ],
    features: [
      'Biologisch afbreekbaar',
      'Kartonnen verpakking',
      'Geschikt voor alle vaatwassers',
      'Fosfaatvrij',
      'Voordeelverpakkingen tot 120 strips',
      'Nederlandse klantenservice'
    ]
  },
  'bio-suds': {
    longDescription: `Bio Suds positioneert zich als het premium biologische alternatief in de vaatwasstrips markt. Met EcoCert-certificering en 100% natuurlijke ingrediënten is dit de keuze voor consumenten die geen compromissen willen sluiten op duurzaamheid.

De hogere prijs wordt gerechtvaardigd door de strenge kwaliteitseisen en externe certificeringen. Bio Suds gebruikt uitsluitend plantaardige oppervlakteactieve stoffen en natuurlijke enzymen voor reinigingskracht. De composteerbare verpakking maakt het totaalplaatje rond. Ideaal voor huishoudens die bewust kiezen voor de meest milieuvriendelijke optie.`,
    pros: [
      'EcoCert gecertificeerd met 100% biologische ingrediënten',
      'Volledig composteerbare verpakking',
      'Geen synthetische geuren of kleurstoffen',
      'Geschikt voor huishoudens met allergieproblemen',
      'Transparante ingrediëntenlijst op de website'
    ],
    cons: [
      'Hoogste prijs per wasbeurt in de vergelijking',
      'Minder effectief bij hardnekkige vetaanslag',
      'Beperkte beschikbaarheid in Nederland',
      'Kleine community en weinig Nederlandse reviews',
      'Geen voordeelverpakkingen beschikbaar'
    ],
    features: [
      'EcoCert gecertificeerd',
      '100% plantaardige ingrediënten',
      'Composteerbare verpakking',
      'Vrij van synthetische geur- en kleurstoffen',
      'Fosfaatvrij en chloorvrij',
      'Geschikt voor vaatwassers met en zonder zout'
    ]
  },
  'bubblyfy': {
    longDescription: `Bubblyfy richt zich op de moderne consument die waarde hecht aan zowel effectiviteit als beleving. Met hun innovatieve formule en frisse geurvarianten zijn ze populair bij jonge gezinnen en bewuste consumenten.

Het merk scoort goed op duurzaamheid (9.0/10) dankzij hun focus op natuurlijke ingrediënten en milieuvriendelijke productie. Bubblyfy investeert in transparantie: hun website toont gedetailleerde informatie over ingrediënten en productieprocessen. De vaatwasstrips lossen snel op en laten geen residu achter op servies.`,
    pros: [
      'Innovatieve formule met natuurlijke ingrediënten',
      'Hoge duurzaamheidsscore (9.0/10)',
      'Transparant over ingrediënten en productieproces',
      'Lost snel en volledig op zonder residu',
      'Meerdere geurvarianten beschikbaar'
    ],
    cons: [
      'Regelmatig uitverkocht bij populaire varianten',
      'Relatief nieuw merk in de markt',
      'Beperkte fysieke verkooppunten',
      'Kan schuimen bij overdosering',
      'Verzendkosten bij kleine bestellingen'
    ],
    features: [
      'Natuurlijke ingrediënten',
      'Biologisch afbreekbaar',
      'Meerdere geurvarianten',
      'Geschikt voor alle vaatwassertypes',
      'Plasticvrije verpakking',
      'Snelle oplossing zonder residu'
    ]
  },
  'cosmeau': {
    longDescription: `Cosmeau is een Nederlands merk dat zich richt op duurzame wasproducten zonder concessies aan kwaliteit. Hun vaatwasstrips zijn ontwikkeld in samenwerking met Nederlandse universiteiten en worden deels lokaal geproduceerd, wat uniek is in deze markt.

Als breed verkrijgbaar merk (ook via Bol.com en andere grote retailers) is Cosmeau de meest toegankelijke keuze. Ze zijn dermatologisch getest en bieden een goede prijs-kwaliteitverhouding. De vaatwasstrips zijn effectief bij lagere temperaturen, wat energiebesparing oplevert. Cosmeau heeft de grootste reviewbasis van alle merken in de vergelijking.`,
    pros: [
      'Ontwikkeld in samenwerking met Nederlandse universiteiten',
      'Breed verkrijgbaar via Bol.com en andere retailers',
      'Dermatologisch getest en geschikt voor gevoelige huid',
      'Uitstekende prijs-kwaliteitverhouding',
      'Grootste aantal reviews en gebruikerservaringen'
    ],
    cons: [
      'Verpakking niet volledig composteerbaar',
      'Kan schuimen in kleine of oudere vaatwassers',
      'Geur verdwijnt relatief snel na de wasbeurt',
      'Minder effectief bij zwaar aangekoekt vet',
      'Productie deels in China'
    ],
    features: [
      'Dermatologisch getest',
      'Effectief vanaf 15°C',
      'Nederlandse productontwikkeling',
      'Fosfaatvrij en chloorvrij',
      'Geschikt voor alle textielsoorten',
      'Biologisch afbreekbaar'
    ]
  },
  'mothers-earth': {
    longDescription: `Mother's Earth is een van de pioniers in de vaatwasstrips markt en was een van de eerste merken die dit concept introduceerde in Nederland. Met een sterke focus op duurzaamheid en natuurlijke ingrediënten, biedt dit merk een alternatief voor traditionele vaatwastabletten.

Het merk heeft de grootste gebruikersbasis met meer dan 1.200 reviews, wat betrouwbare beoordelingsdata oplevert. Mother's Earth strips zijn 100% plasticvrij verpakt en bevatten geen schadelijke chemicaliën. Let op: de verzending vindt plaats vanuit China, waardoor de levertijd 5-9 werkdagen kan bedragen. De prijs per wasbeurt is competitief, vooral bij grotere verpakkingen.`,
    pros: [
      '100% plasticvrije verpakking',
      'Grootste gebruikersbasis met 1.200+ geverifieerde reviews',
      'Veganistisch en dierproefvrij',
      'Effectief bij lage temperaturen (vanaf 20°C)',
      'Voordeelverpakkingen met lagere prijs per wasbeurt'
    ],
    cons: [
      'Verzending vanuit China (5-9 werkdagen levertijd)',
      'Geen Nederlandse klantenservice',
      'Beperkte geurkeuze',
      'Minder effectief bij zwaar aangekoekte pannen',
      'CO2-uitstoot door internationale verzending'
    ],
    features: [
      '100% plasticvrije verpakking',
      'Veganistisch en dierproefvrij',
      'Effectief vanaf 20°C',
      'Hypoallergeen',
      'Compact en licht voor opslag',
      'Biologisch afbreekbaar'
    ]
  }
};

async function main() {
  for (const [slug, content] of Object.entries(brandContent)) {
    await prisma.product.update({
      where: { slug },
      data: {
        longDescription: content.longDescription,
        pros: content.pros,
        cons: content.cons,
        features: content.features,
      },
    });
    console.log(`Updated: ${slug}`);
  }
  console.log('Done! All brand content enriched.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
