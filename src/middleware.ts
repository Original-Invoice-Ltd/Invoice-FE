import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    // Check for auth cookie — the actual role validation happens client-side
    // since the JWT is in an HTTP-only cookie we can't decode here without the secret
    const authCookie =
        request.cookies.get("accessToken") ??
        request.cookies.get("access_token") ??
        request.cookies.get("token") ??
        request.cookies.get("JSESSIONID");

    if (!authCookie) {
        const signInUrl = new URL("/signIn", request.url);
        signInUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
