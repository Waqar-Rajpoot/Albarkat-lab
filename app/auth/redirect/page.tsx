import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { roleRedirectPath } from "@/lib/role-redirect";

export default async function AuthRedirectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  redirect(roleRedirectPath(session.user.role));
}
