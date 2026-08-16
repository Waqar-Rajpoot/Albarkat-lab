"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bone, FlaskConical, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/xrays", label: "X-Rays", icon: Bone },
  { href: "/admin/tests", label: "Lab Tests", icon: FlaskConical },
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-semibold text-text">
            AL-Barkat Admin
          </Link>

          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-background-light hover:text-text"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <SignOutButton />
      </div>
    </header>
  );
}