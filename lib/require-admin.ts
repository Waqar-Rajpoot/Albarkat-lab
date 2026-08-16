import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";

/**
 * Call this at the top of every admin-only API route. It returns the
 * session when the caller is a logged-in admin, or a ready-to-return
 * NextResponse (401/403) otherwise.
 *
 * This is the REAL security boundary for admin API routes — proxy.ts
 * and app/admin/layout.tsx only protect the browser UI. Someone can
 * always call /api/admin/xrays directly with curl/Postman, so the API
 * itself must check the role independently.
 *
 * Usage:
 *   const guard = await requireAdmin();
 *   if (guard instanceof NextResponse) return guard;
 *   const session = guard; // typed, session.user.role === "admin"
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return session;
}