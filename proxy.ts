// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// export function proxy(request: NextRequest) {
//   const sessionCookie = getSessionCookie(request);

//   if (!sessionCookie) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };








import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Reachable regardless of auth state OR role — even a logged-in user might
// need to verify an email or reset a password.
const ALWAYS_ALLOWED = ["/verify-email", "/reset-password", "/forgot-password"];

// Only for logged-OUT visitors. A logged-in user (either role) gets bounced
// away from these instead of seeing the sign-in/sign-up form again.
const GUEST_ONLY = ["/sign-in", "/sign-up"];

function matchesPrefix(pathname: string, list: string[]) {
  return list.some((path) => pathname.startsWith(path));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (matchesPrefix(pathname, ALWAYS_ALLOWED)) {
    return NextResponse.next();
  }

  // Real role check requires the actual session record, not just cookie
  // presence — a cookie can be forged, so this can't be a cheap edge check.
  const session = await auth.api.getSession({ headers: request.headers });

  const isAdminRoute = pathname.startsWith("/admin");
  const isGuestOnlyRoute = matchesPrefix(pathname, GUEST_ONLY);

  if (!session) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  const role = session.user.role;

  // Logged in and trying to view sign-in/sign-up — send them to where they
  // actually belong instead.
  if (isGuestOnlyRoute) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/", request.url)
    );
  }

  if (role === "admin") {
    // Admin hitting a non-admin route gets bounced to the dashboard.
    if (!isAdminRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Any non-admin (role === "user") trying to reach /admin gets sent home.
  if (isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// NOTE: this matcher currently covers the whole site (minus static assets),
// which means every request now costs a MongoDB round-trip via
// auth.api.getSession — including the homepage, /about, /blog, etc.
// That's a real performance and DB-load cost for a check that, outside of
// /admin and guest-only routes, is a UX preference rather than a security
// requirement. If you only care about admins being bounced off booking
// flows (already gated per-form) and keeping /admin locked to admins,
// narrow this matcher instead, e.g.:
//   matcher: ["/admin/:path*", "/sign-in", "/sign-up", "/book-test", "/book-xray", "/home-sampling", "/book-package", "/online-report"]
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};