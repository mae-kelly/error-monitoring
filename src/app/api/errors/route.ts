import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const view = searchParams.get('view');
  
  if (view === 'stats') {
    const total = await prisma.error.count();
    const open = await prisma.error.count({ where: { status: 'OPEN' } });
    const resolved = await prisma.error.count({ where: { status: 'RESOLVED' } });
    const critical = await prisma.error.count({ where: { status: 'CRITICAL' } });
    
    const errorTypes = await prisma.error.groupBy({
      by: ['errorType'],
      _count: true,
      orderBy: { _count: { errorType: 'desc' } },
      take: 10,
    });
    
    const recentErrors = await prisma.error.findMany({
      orderBy: { receivedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        errorType: true,
        receivedAt: true,
        status: true,
      },
    });
    
    return NextResponse.json({
      total,
      open,
      resolved,
      critical,
      errorTypes: errorTypes.map(et => ({
        errorType: et.errorType,
        count: et._count,
      })),
      recentErrors,
    });
  }
  
  if (view === 'timeline') {
    const errors = await prisma.error.findMany({
      orderBy: { receivedAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(errors);
  }
  
  if (view === 'frequency') {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const frequency24h = await prisma.error.groupBy({
      by: ['errorType'],
      where: { receivedAt: { gte: last24h } },
      _count: true,
      orderBy: { _count: { errorType: 'desc' } },
    });
    
    const frequency7d = await prisma.error.groupBy({
      by: ['errorType'],
      where: { receivedAt: { gte: last7d } },
      _count: true,
      orderBy: { _count: { errorType: 'desc' } },
    });
    
    const frequency30d = await prisma.error.groupBy({
      by: ['errorType'],
      where: { receivedAt: { gte: last30d } },
      _count: true,
      orderBy: { _count: { errorType: 'desc' } },
    });
    
    return NextResponse.json({
      last24h: frequency24h.map(f => ({ errorType: f.errorType, count: f._count })),
      last7d: frequency7d.map(f => ({ errorType: f.errorType, count: f._count })),
      last30d: frequency30d.map(f => ({ errorType: f.errorType, count: f._count })),
    });
  }
  
  if (view === 'types') {
    const errorTypes = await prisma.error.groupBy({
      by: ['errorType'],
      _count: true,
      orderBy: { _count: { errorType: 'desc' } },
    });
    
    const typeDetails = await Promise.all(
      errorTypes.map(async (et) => {
        const errors = await prisma.error.findMany({
          where: { errorType: et.errorType },
          orderBy: { receivedAt: 'desc' },
          take: 5,
        });
        
        const resolution = await prisma.resolution.findUnique({
          where: { errorType: et.errorType },
        });
        
        return {
          errorType: et.errorType,
          count: et._count,
          recentErrors: errors,
          hasResolution: !!resolution,
        };
      })
    );
    
    return NextResponse.json(typeDetails);
  }
  
  const errors = await prisma.error.findMany({
    orderBy: { receivedAt: 'desc' },
    take: 50,
  });
  
  return NextResponse.json(errors);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status, assignedTo } = body;
  
  const updated = await prisma.error.update({
    where: { id },
    data: {
      status,
      assignedTo,
      resolvedAt: status === 'RESOLVED' ? new Date() : null,
    },
  });
  
  return NextResponse.json(updated);
}