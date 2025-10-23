import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl, getTokenFromCode } from '@/lib/outlook';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  
  if (!code) {
    const authUrl = await getAuthUrl();
    return NextResponse.redirect(authUrl);
  }
  
  try {
    const tokenResponse = await getTokenFromCode(code);
    
    await prisma.outlookToken.create({
      data: {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken!,
        expiresAt: new Date(Date.now() + (tokenResponse.expiresIn || 3600) * 1000),
      },
    });
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?auth=success`);
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}