import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateOrigin } from '@/lib/validate-origin';

export async function POST(request: NextRequest) {
  // Origin validation
  const originError = validateOrigin(request.headers.get('origin'));
  if (originError) {
    return NextResponse.json({ error: originError }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { productId, rating, title, content, userName, userEmail } = body;

    // Validation
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be 1-5' }, { status: 400 });
    }
    if (!title || typeof title !== 'string' || title.length < 3 || title.length > 200) {
      return NextResponse.json({ error: 'title must be 3-200 characters' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.length < 10 || content.length > 2000) {
      return NextResponse.json({ error: 'content must be 10-2000 characters' }, { status: 400 });
    }
    if (!userName || typeof userName !== 'string' || userName.length < 2 || userName.length > 100) {
      return NextResponse.json({ error: 'userName must be 2-100 characters' }, { status: 400 });
    }
    if (userEmail && typeof userEmail === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create review (unverified by default)
    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        title: title.trim(),
        content: content.trim(),
        userName: userName.trim(),
        userEmail: userEmail?.trim() || null,
        verified: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Review ontvangen. Na verificatie wordt deze zichtbaar.',
      reviewId: review.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
