// File: src/app/api/auth/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_session');
    
    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null 
      });
    }

    // Parse the auth session
    const session = JSON.parse(authCookie.value);
    
    // Check if session is expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null 
      });
    }

    return NextResponse.json({ 
      authenticated: true, 
      user: session.user 
    });
  } catch (error) {
    console.error('Auth status check failed:', error);
    return NextResponse.json({ 
      authenticated: false, 
      user: null 
    });
  }
}