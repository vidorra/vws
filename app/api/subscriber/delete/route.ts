import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ email: z.string().email() });

/**
 * DELETE /api/subscriber/delete
 * GDPR right-to-erasure: permanently deletes a subscriber and all associated price alerts.
 */
export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });
  }

  const { email } = parsed.data;

  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { email } });

    if (!subscriber) {
      // Return 200 to avoid leaking whether an email exists
      return NextResponse.json({ success: true });
    }

    await prisma.$transaction([
      prisma.priceAlert.deleteMany({ where: { email } }),
      prisma.subscriber.delete({ where: { email } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscriber deletion error:', error);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
