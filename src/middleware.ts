import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Route protection is handled client-side in admin/layout.tsx
    // The backend uses HTTP-only cookies that cannot be reliably inspected
    // in Next.js edge middleware without knowing the exact cookie name
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
