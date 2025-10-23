// File: src/app/api/auth/token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAccessToken } from '@/lib/outlook';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_session');
    
    if (!authCookie || !authCookie.value) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }

    // Get fresh access token from Outlook
    const accessToken = await getAccessToken();
    
    return NextResponse.json({ 
      accessToken 
    });
  } catch (error) {
    console.error('Token retrieval failed:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' }, 
      { status: 500 }
    );
  }
}