import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
        
    // Forward login request to Spring Boot backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });

    if (backendResponse.ok) {
      const responseData = await backendResponse.json();
      
      // Forward Set-Cookie header from Spring Boot to browser
      const setCookieHeader = backendResponse.headers.get('set-cookie');

      // Return response body as-is
      const response = NextResponse.json({
        status: backendResponse.status,
        data: responseData,
      });

      // Add Set-Cookie header if present
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
      }

      return response;
    } else {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          status: backendResponse.status,
          error: errorData.message || errorData.error || 'Login failed'
        },
        { status: backendResponse.status }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
