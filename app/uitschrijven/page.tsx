import { Metadata } from 'next';
import Link from 'next/link';
import { getSite } from '@/lib/get-site';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    title: `Uitschrijven | ${site.name}`,
    robots: { index: false },
  };
}

function getMessages(contactEmail: string): Record<string, { title: string; body: string; ok: boolean }> {
  return {
    success: {
      title: 'Je bent uitgeschreven',
      body: 'Je ontvangt geen e-mails meer van ons. Je kunt je altijd opnieuw aanmelden via onze website.',
      ok: true,
    },
    notfound: {
      title: 'Link niet gevonden',
      body: 'Deze uitschrijflink is ongeldig of al gebruikt.',
      ok: false,
    },
    invalid: {
      title: 'Ongeldige link',
      body: 'De uitschrijflink mist een geldig token. Controleer de link in je e-mail.',
      ok: false,
    },
    error: {
      title: 'Er ging iets mis',
      body: `Probeer het later opnieuw of stuur een e-mail naar ${contactEmail}.`,
      ok: false,
    },
  };
}

export default function UitschrijvenPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const site = getSite();
  const messages = getMessages(site.contactEmail);
  const status = searchParams.status ?? 'invalid';
  const msg = messages[status] ?? messages.invalid;

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className={`text-5xl mb-6`}>{msg.ok ? '✅' : '❌'}</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{msg.title}</h1>
      <p className="text-gray-600 mb-8">{msg.body}</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Terug naar home
      </Link>
    </div>
  );
}
