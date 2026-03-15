import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:8089';

export async function POST(request: NextRequest, { params }: { params: { invoiceId: string } }) {
  try {
    const { invoiceId } = params;
    
    // Get FormData from request
    const formData = await request.formData();
    
    // Forward request to Spring Boot backend (no auth required - public endpoint)
    const backendResponse = await fetch(`${BACKEND_URL}/api/invoices/${invoiceId}/upload-evidence`, {
      method: 'POST',
      body: formData, // FormData automatically sets correct Content-Type with boundary
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
    console.error('Upload evidence API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}