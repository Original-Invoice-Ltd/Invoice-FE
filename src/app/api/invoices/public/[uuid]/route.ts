import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:8089';

export async function GET(request: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const { uuid } = params;
    
    // Forward request to Spring Boot backend (no auth required)
    const backendResponse = await fetch(`${BACKEND_URL}/api/invoices/public/${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseBody = await backendResponse.arrayBuffer();
    
    // Create response with same status and headers
    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });
      

    // Copy response headers
    backendResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Public invoice API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}