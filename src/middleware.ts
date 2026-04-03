import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    // Check for any auth cookie
    const cookies = request.cookies;
    const hasAuth =
        cookies.has("accessToken") ||
        cookies.has("access_token") ||
        cookies.has("token") ||
        cookies.has("JSESSIONID") ||
        cookies.has("refreshToken") ||
        cookies.has("refresh_token") ||
        // Check any cookie that might contain auth
        [...cookies.getAll()].some(c =>
            c.name.toLowerCase().includes("token") ||
            c.name.toLowerCase().includes("session") ||
            c.name.toLowerCase().includes("auth")
        );

    if (!hasAuth) {
        const signInUrl = new URL("/signIn", request.url);
        signInUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
