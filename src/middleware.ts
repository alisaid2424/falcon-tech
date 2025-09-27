import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { Pages, Routes } from "./constants/enums";
import { UserRole } from "@prisma/client";

export default withAuth(
  async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const role = token?.role;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = [Pages.LOGIN, Pages.Register].some((route) =>
      pathname.startsWith(route)
    );
    const protectedRoutes = [Routes.PROFILE, Routes.ADMIN];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAdminRoute = pathname.startsWith(Routes.ADMIN);

    // Redirect unauthenticated users trying to access protected routes to login
    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL(Pages.LOGIN, request.url));
    }

    // Redirect authenticated users away from login/register pages
    if (token && isAuthPage) {
      const destination =
        role === UserRole.ADMIN ? Routes.ADMIN : Routes.PROFILE;
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // Prevent non-admin users from accessing admin routes
    if (token && isAdminRoute && role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(Routes.PROFILE, request.url));
    }

    // Redirect admin users to the admin dashboard right after login
    const fromLogin = request.headers.get("referer")?.includes(Pages.LOGIN);
    if (token && role === UserRole.ADMIN && !isAdminRoute && fromLogin) {
      return NextResponse.redirect(new URL(Routes.ADMIN, request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

// Apply middleware to all routes except API, static files, and public assets
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
