// File: src/app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/outlook';

export async function GET(request: NextRequest) {
  try {
    const authUrl = await getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Sign-in redirect failed:', error);
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 500 }
    );
  }
}