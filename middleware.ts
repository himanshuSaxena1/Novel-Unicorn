import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // If no referral parameter, proceed with normal auth middleware
  return await handleAuthMiddleware(request);
}

async function handleAuthMiddleware(
  request: NextRequest,
  response?: NextResponse
) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Admin, Moderator, Translator routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    // No token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Only ADMIN can access all /admin routes
    if (token.role === UserRole.ADMIN) {
      return response || NextResponse.next();
    }

    // MODERATOR access: Allow specific routes, block sensitive ones
    if (
      token.role === UserRole.MODERATOR ||
      token.role === UserRole.TRANSLATOR
    ) {
      const allowedModeratorRoutes = [
        "/admin/novels",
        "/admin/chapters",
      ];

      // Check if the requested path matches allowed routes (including sub-paths)
      const isAllowed = allowedModeratorRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAllowed) {
        return response || NextResponse.next();
      }

      // Redirect moderators trying to access restricted admin routes
      return NextResponse.redirect(new URL("/admin/novels", request.url));
    }

    // Non-ADMIN, non-MODERATOR: redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Challenges and Book Clubs: Restricted to ADMIN only
  if (
    pathname.startsWith("/challenges") ||
    pathname.startsWith("/book-clubs")
  ) {
    if (!token || token.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // User-protected routes
  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/insights")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Redirect logged-in users away from login/signup
  if (pathname === "/auth/signin" || pathname === "/auth/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response || NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/bookmarks/:path*",
    "/auth/signin",
    "/auth/signup",
    // Add any route that might have referral parameters
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
