import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/subscriber/unsubscribe?token=<verifyToken>
 * One-click unsubscribe via tokenised link (included in email footers).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/uitschrijven?status=invalid', request.url));
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { verifyToken: token } });

    if (!subscriber) {
      return NextResponse.redirect(new URL('/uitschrijven?status=notfound', request.url));
    }

    await prisma.subscriber.update({
      where: { verifyToken: token },
      data: {
        active: false,
        priceAlerts: false,
        newsletter: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.redirect(new URL('/uitschrijven?status=success', request.url));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(new URL('/uitschrijven?status=error', request.url));
  }
}
