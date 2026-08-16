"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bone, ChevronDown, FlaskConical, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useClickOutside } from "@/hooks/use-click-outside";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/xrays", label: "X-Rays", icon: Bone },
  { href: "/admin/tests", label: "Lab Tests", icon: FlaskConical },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "AD";
}

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(profileMenuRef, () => setIsProfileMenuOpen(false));

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        {/* Left: logo */}
        <Link href="/admin" className="flex shrink-0 items-center gap-2">
          <Image
            src="/al_barkat_logo_vector-1.svg"
            alt="AL-Barkat Lab"
            width={28}
            height={38}
            priority
          />
          <span className="hidden text-sm font-semibold text-text sm:inline">
            AL-Barkat Lab
          </span>
        </Link>

        {/* Center: links (desktop only) */}
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
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

        {/* Right: profile + mobile toggle */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative hidden md:block" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-text transition-colors hover:bg-background-light"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Admin"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {getInitials(user?.name, user?.email)}
                </span>
              )}
              <span className="max-w-[10rem] truncate">{user?.name ?? "Admin"}</span>
              <ChevronDown className="h-4 w-4 text-text-secondary" />
            </button>

            {isProfileMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-md border border-border bg-surface py-1 shadow-lg"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-medium text-text">{user?.name ?? "Admin"}</p>
                  <p className="truncate text-xs text-text-secondary">{user?.email}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-background-light hover:text-text"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="admin-mobile-nav"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-light hover:text-text md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        id="admin-mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-surface transition-[max-height] duration-200 ease-in-out md:hidden",
          isMobileMenuOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          <div className="mb-1 flex items-center gap-2 border-b border-border px-1 pb-3">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Admin"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {getInitials(user?.name, user?.email)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text">{user?.name ?? "Admin"}</p>
              <p className="truncate text-xs text-text-secondary">{user?.email}</p>
            </div>
          </div>

          {links.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-2 rounded-md border-t border-border px-3 pt-3 text-sm font-medium text-text-secondary transition-colors hover:text-text"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}