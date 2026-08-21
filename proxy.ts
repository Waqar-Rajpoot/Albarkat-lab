import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const ALWAYS_ALLOWED = ["/verify-email", "/reset-password", "/forgot-password"];

const GUEST_ONLY = ["/sign-in", "/sign-up"];

function matchesPrefix(pathname: string, list: string[]) {
  return list.some((path) => pathname.startsWith(path));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (matchesPrefix(pathname, ALWAYS_ALLOWED)) {
    return NextResponse.next();
  }

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

  if (isGuestOnlyRoute) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/", request.url)
    );
  }

  if (role === "admin") {
    if (!isAdminRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};