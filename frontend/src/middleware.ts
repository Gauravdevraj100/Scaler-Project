import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register"];
// Routes that logged-in users should be redirected from
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);

    const session = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production",
    });

    const path = request.nextUrl.pathname;

    // Debug logging
    console.log("Middleware running for path:", path);
    console.log("Session exists:", !!session);
    console.log("Session details:", session);

    // If user is not logged in and trying to access protected route
    // Skip authentication check for root path
    if (!session && !publicRoutes.includes(path) && path !== "/") {
        console.log("Redirecting to login - protected route access attempt");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user is logged in and trying to access auth routes (login/register)
    if (session && authRoutes.includes(path)) {
        console.log(
            "Redirecting to movies - auth route access while logged in"
        );
        return NextResponse.redirect(new URL("/movies", request.url));
    }

    return NextResponse.next({ headers });
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
