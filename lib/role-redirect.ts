export function roleRedirectPath(role: string | null | undefined) {
  return role === "admin" ? "/admin" : "/dashboard";
}
