import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSession, destroySession } from '@/lib/session';

const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:8089';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.jwt || !session.isAuthenticated) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    // Call Spring Boot refresh endpoint with current JWT
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwt}`,
      },
    });

    if (backendResponse.ok) {
      const responseData = await backendResponse.json().catch(() => ({}));
      
      // Extract new JWT from response
      const newJwt = backendResponse.headers.get('Authorization')?.replace('Bearer ', '') || 
                     responseData.token || 
                     responseData.accessToken ||
                     session.jwt; // Fallback to existing JWT if no new one provided
      
      // Update session with new JWT
      await createSession(newJwt, session.user);

      return NextResponse.json({
        status: 200,
        message: 'Token refreshed successfully'
      });
    } else {
      // If refresh fails, destroy session
      await destroySession();
      return NextResponse.json(
        { error: 'Token refresh failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Refresh API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}