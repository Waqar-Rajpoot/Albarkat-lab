"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

type Role = "user" | "admin";
const ROLES: Role[] = ["user", "admin"];

type User = {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const dateFormatter = new Intl.DateTimeFormat("en-PK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "U";
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  async function loadUsers(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/users?page=${targetPage}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load users");
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers(page);
  }, [page]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget._id;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      // If this was the last row on a page beyond the first, step back a
      // page and let the effect re-fetch — otherwise just refresh in place.
      const isLastRowOnPage = users.length === 1 && page > 1;
      if (isLastRowOnPage) {
        setPage((p) => p - 1);
      } else {
        await loadUsers(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  }

  async function handleRoleChange(user: User, nextRole: Role) {
    if (user.role === nextRole) return;

    setUpdatingRoleId(user._id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update role");
      await loadUsers(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setUpdatingRoleId(null);
    }
  }

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:py-16">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <UsersIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-text">Users</h1>
            <p className="text-sm text-text-secondary">
              Everyone registered on the platform.
              {pagination ? ` ${pagination.total} total.` : ""}
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-error-light bg-error-light px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-36">Role</TableHead>
                <TableHead className="w-32">Joined</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-text-secondary">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-text-secondary">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const isSelf = user._id === currentUserId;
                  const isUpdating = updatingRoleId === user._id;

                  return (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                              {getInitials(user.name, user.email)}
                            </span>
                          )}
                          <span className="font-medium text-text">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          {user.email}
                          {user.emailVerified && (
                            <BadgeCheck
                              className="h-4 w-4 shrink-0 text-success"
                              aria-label="Email verified"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* Single source of truth for role: the badge IS the
                            control. No separate role display + separate
                            action elsewhere — this dropdown trigger is
                            styled directly (not wrapping a <Button>) so we
                            never nest two real <button> elements, which is
                            invalid HTML and breaks hydration. */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            disabled={isUpdating || isSelf}
                            title={
                              isSelf
                                ? "You can't change your own role"
                                : "Click to change role"
                            }
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                              "disabled:cursor-not-allowed disabled:opacity-60",
                              user.role === "admin"
                                ? "bg-accent-blue-light text-secondary"
                                : "bg-background-light text-text-secondary",
                              !isSelf && "hover:opacity-80"
                            )}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              user.role === "admin" && (
                                <ShieldCheck className="h-3 w-3" />
                              )
                            )}
                            <span className="capitalize">{user.role}</span>
                            {!isSelf && <ChevronDown className="h-3 w-3 opacity-60" />}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <div className="px-2 py-1.5 text-xs font-medium text-text-secondary">
                              Change role
                            </div>
                            {ROLES.map((role) => (
                              <DropdownMenuItem
                                key={role}
                                className="capitalize"
                                onClick={() => handleRoleChange(user, role)}
                                disabled={user.role === role}
                              >
                                {user.role === role && (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                                {role}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-error hover:bg-error-light hover:text-error"
                            onClick={() => setDeleteTarget(user)}
                            disabled={deletingId === user._id}
                            aria-label={`Delete ${user.name}`}
                          >
                            {deletingId === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-sm text-text-secondary">
              {pagination
                ? `Page ${pagination.page} of ${totalPages}`
                : "Page 1 of 1"}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={loading || page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={loading || page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  This will permanently remove{" "}
                  <span className="font-medium text-text">{deleteTarget.name}</span>{" "}
                  ({deleteTarget.email}) and sign them out of any active session.
                  This can&apos;t be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}