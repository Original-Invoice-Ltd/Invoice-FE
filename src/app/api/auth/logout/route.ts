import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    await destroySession();
    return NextResponse.json({
      status: 200,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}