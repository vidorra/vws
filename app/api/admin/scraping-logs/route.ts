import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const supplier = searchParams.get('supplier');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter conditions
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (supplier) {
      where.supplier = {
        contains: supplier,
        mode: 'insensitive'
      };
    }

    // Fetch logs from database
    const logs = await prisma.scrapingLog.findMany({
      where,
      orderBy: {
        startedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.scrapingLog.count({ where });

    // Calculate summary statistics for last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const summary = await prisma.scrapingLog.groupBy({
      by: ['status'],
      where: {
        startedAt: {
          gte: oneDayAgo
        }
      },
      _count: {
        status: true
      }
    });

    const summaryStats = {
      total: summary.reduce((acc, item) => acc + item._count.status, 0),
      successful: summary.find(s => s.status === 'success')?._count.status || 0,
      failed: summary.find(s => s.status === 'failed')?._count.status || 0,
      running: summary.find(s => s.status === 'running')?._count.status || 0
    };

    // Get average scraping duration
    const avgDuration = await prisma.scrapingLog.aggregate({
      where: {
        status: 'success',
        duration: { not: null },
        startedAt: { gte: oneDayAgo }
      },
      _avg: {
        duration: true
      }
    });

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log.id,
        productId: log.productId,
        supplier: log.supplier,
        status: log.status,
        message: log.message,
        oldPrice: log.oldPrice,
        newPrice: log.newPrice,
        priceChange: log.priceChange,
        startedAt: log.startedAt,
        completedAt: log.completedAt,
        duration: log.duration
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      summary: {
        ...summaryStats,
        avgDuration: avgDuration._avg.duration || 0
      }
    });

  } catch (error) {
    console.error('Error fetching scraping logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for cleaning old logs
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete logs older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const deletedLogs = await prisma.scrapingLog.deleteMany({
      where: {
        startedAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    return NextResponse.json({
      message: `Deleted ${deletedLogs.count} old log entries`,
      deletedCount: deletedLogs.count
    });

  } catch (error) {
    console.error('Error cleaning up logs:', error);
    return NextResponse.json(
      { error: 'Failed to clean up logs' },
      { status: 500 }
    );
  }
}