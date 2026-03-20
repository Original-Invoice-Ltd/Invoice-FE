import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_BASE_URL;

async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const pathSegments = (await params).path;
    const cleanPath = pathSegments[0] === 'api'
      ? pathSegments.slice(1).join('/')
      : pathSegments.join('/');
    const url = new URL(request.url);
    const targetUrl = `${BACKEND_URL}/api/${cleanPath}${url.search}`;

    const headers: Record<string, string> = {
      'Cookie': request.headers.get('cookie') || ''
    };

    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (contentType?.includes('multipart/form-data')) {
        delete headers['Content-Type'];
        body = await request.formData();
      } else if (contentType?.includes('application/json')) {
        body = JSON.stringify(await request.json());
      } else {
        body = await request.text();
      }
    }

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseBody = await backendResponse.arrayBuffer();

    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    backendResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;