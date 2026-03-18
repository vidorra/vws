import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAdmin, generateToken } from '@/lib/auth';
import { LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS } from '@/lib/constants';
import { logger } from '@/lib/logger';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// In-memory rate limiter: ip -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + LOGIN_RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= LOGIN_RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Te veel pogingen. Probeer het over 15 minuten opnieuw.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ongeldig verzoek' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const isValid = await validateAdmin(email, password);

    if (isValid) {
      const token = generateToken(email);
      return NextResponse.json({ token });
    }

    return NextResponse.json({ error: 'Ongeldige inloggegevens' }, { status: 401 });
  } catch (error) {
    logger.error('Login error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
