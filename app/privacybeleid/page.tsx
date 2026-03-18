import { Metadata } from 'next';
import { getSite } from '@/lib/get-site';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `Privacybeleid | ${site.name}`,
    description: 'Ons privacybeleid beschrijft hoe wij omgaan met je persoonlijke gegevens.',
  };
}

export default function PrivacybeleidPage() {
  const site = getSite();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacybeleid</h1>
      <p className="text-sm text-gray-500 mb-8">Laatst bijgewerkt: maart 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Wie zijn wij?</h2>
          <p>
            {site.name} is een onafhankelijke vergelijkingssite voor {site.productNoun} in Nederland.
            Je kunt ons bereiken via <a href={`mailto:${site.contactEmail}`} className="text-blue-600 hover:underline">{site.contactEmail}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Welke gegevens verzamelen wij?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>E-mailadres</strong> — alleen als je je inschrijft voor prijsalerts of onze nieuwsbrief.</li>
            <li><strong>Affiliate-klikken</strong> — wij registreren anoniem wanneer je via onze site naar een winkel gaat (zonder persoonlijke gegevens).</li>
            <li><strong>Analytics</strong> — geanonimiseerd websitebezoek via Vercel Analytics. Er worden geen IP-adressen opgeslagen.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Waarvoor gebruiken wij je gegevens?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Het versturen van prijsalerts die je zelf hebt aangevraagd.</li>
            <li>Het verbeteren van onze website op basis van geanonimiseerde statistieken.</li>
            <li>Het bijhouden van prestaties van affiliate-links (zonder koppeling aan jou persoonlijk).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies</h2>
          <p>Wij gebruiken alleen functionele en analytische cookies:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Functioneel</strong> — om jouw cookievoorkeur op te slaan.</li>
            <li><strong>Analytisch</strong> — geanonimiseerde paginaweergaven via Vercel Analytics (alleen na toestemming).</li>
          </ul>
          <p className="mt-2">Je kunt cookies weigeren via de cookiebanner. Je kunt je cookievoorkeur altijd wijzigen door je browsercookies te verwijderen.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Affiliate-links</h2>
          <p>
            Sommige links op deze site zijn affiliate-links. Als je via zo&apos;n link een aankoop doet, ontvangen wij mogelijk een kleine vergoeding van de aanbieder.
            Dit heeft geen invloed op de prijs die jij betaalt en ook niet op onze objectieve vergelijkingen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Delen met derden</h2>
          <p>
            Wij verkopen je gegevens nooit aan derden. We delen gegevens alleen met verwerkers die noodzakelijk zijn voor onze dienstverlening (zoals onze hostingprovider),
            en alleen op basis van een verwerkersovereenkomst.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Jouw rechten (AVG)</h2>
          <p>Onder de AVG heb je recht op:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Inzage in de gegevens die wij van jou bewaren.</li>
            <li>Correctie van onjuiste gegevens.</li>
            <li>Verwijdering van jouw gegevens (&apos;recht op vergetelheid&apos;).</li>
            <li>Beperking van de verwerking.</li>
            <li>Bezwaar maken tegen verwerking.</li>
          </ul>
          <p className="mt-2">
            Stuur een e-mail naar <a href={`mailto:${site.contactEmail}`} className="text-blue-600 hover:underline">{site.contactEmail}</a> om een van deze rechten uit te oefenen.
            Wij reageren binnen 30 dagen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Beveiliging</h2>
          <p>
            Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen, waaronder HTTPS-versleuteling en beveiligde databaseopslag.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Klachten</h2>
          <p>
            Als je een klacht hebt over hoe wij omgaan met je gegevens, kun je contact met ons opnemen. Je hebt ook het recht om een klacht in te dienen bij de
            Autoriteit Persoonsgegevens via <a href="https://www.autoriteitpersoonsgegevens.nl" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">autoriteitpersoonsgegevens.nl</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
