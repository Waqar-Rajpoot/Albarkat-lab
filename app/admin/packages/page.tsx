"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Loader2,
  Package as PackageIcon,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
import { ListFilters } from "@/components/admin/list-filters";
import { PaginationControls, type Pagination } from "@/components/admin/pagination-controls";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Package = {
  _id: string;
  title: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  includedTests: string[];
  isFeatured: boolean;
};

type FormState = {
  title: string;
  description: string;
  discountedPrice: string;
  originalPrice: string;
  includedTests: string[];
};

const emptyForm: FormState = {
  title: "",
  description: "",
  discountedPrice: "",
  originalPrice: "",
  includedTests: [""],
};

const PAGE_SIZE = 9;

const priceFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "—";
  return priceFormatter.format(price);
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const debouncedMinPrice = useDebouncedValue(minPrice);
  const debouncedMaxPrice = useDebouncedValue(maxPrice);
  const hasActiveFilters = Boolean(search || minPrice || maxPrice);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function loadPackages(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(PAGE_SIZE),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (debouncedMinPrice) params.set("minPrice", debouncedMinPrice);
      if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);

      const res = await fetch(`/api/admin/packages?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load packages");
      setPackages(data.packages);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  // Reset to page 1 whenever the filters change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch, debouncedMinPrice, debouncedMaxPrice]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPackages(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, debouncedMinPrice, debouncedMaxPrice]);

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
  }

  function startEdit(pkg: Package) {
    setEditingId(pkg._id);
    setForm({
      title: pkg.title,
      description: pkg.description,
      discountedPrice: String(pkg.discountedPrice),
      originalPrice: String(pkg.originalPrice),
      includedTests: pkg.includedTests.length > 0 ? pkg.includedTests : [""],
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateTestLine(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      includedTests: prev.includedTests.map((t, i) => (i === index ? value : t)),
    }));
  }

  function addTestLine() {
    setForm((prev) => ({ ...prev, includedTests: [...prev.includedTests, ""] }));
  }

  function removeTestLine(index: number) {
    setForm((prev) => ({
      ...prev,
      includedTests:
        prev.includedTests.length > 1
          ? prev.includedTests.filter((_, i) => i !== index)
          : prev.includedTests,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(
        editingId ? `/api/admin/packages/${editingId}` : "/api/admin/packages",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            discountedPrice: Number(form.discountedPrice),
            originalPrice: Number(form.originalPrice),
            includedTests: form.includedTests,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      cancelEdit();
      await loadPackages(editingId ? page : 1);
      if (!editingId) setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function toggleFeatured(pkg: Package) {
    const nextValue = !pkg.isFeatured;
    setTogglingId(pkg._id);
    setError(null);

    // Optimistically flip the badge, then reconcile with the server response.
    setPackages((prev) =>
      prev.map((p) => (p._id === pkg._id ? { ...p, isFeatured: nextValue } : p))
    );

    try {
      const res = await fetch(`/api/admin/packages/${pkg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update featured status");

      setPackages((prev) =>
        prev.map((p) => (p._id === pkg._id ? { ...p, isFeatured: data.package.isFeatured } : p))
      );
    } catch (err) {
      // Roll back the optimistic update on failure.
      setPackages((prev) =>
        prev.map((p) => (p._id === pkg._id ? { ...p, isFeatured: pkg.isFeatured } : p))
      );
      setError(
        err instanceof Error ? err.message : "Failed to update featured status"
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget._id;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      if (editingId === id) cancelEdit();

      const isLastRowOnPage = packages.length === 1 && page > 1;
      if (isLastRowOnPage) {
        setPage((p) => p - 1);
      } else {
        await loadPackages(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:py-16">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <PackageIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-text">Health Packages</h1>
            <p className="text-sm text-text-secondary">
              Manage discounted test bundles shown to patients.
              {pagination ? ` ${pagination.total} total.` : ""}
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-text">
              {editingId ? "Edit package" : "Add a new package"}
            </p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Diabetes Monitoring"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Diabetes is a manageable condition if detected and properly treated."
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="discountedPrice">Discounted price (PKR)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="17300"
                  required
                  value={form.discountedPrice}
                  onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="originalPrice">Original price (PKR)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="21600"
                  required
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Included tests</Label>
              <div className="flex flex-col gap-2">
                {form.includedTests.map((test, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Blood Sugar"
                      value={test}
                      onChange={(e) => updateTestLine(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTestLine(index)}
                      disabled={form.includedTests.length === 1}
                      aria-label={`Remove line ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTestLine}
                className="self-start"
              >
                <Plus className="h-4 w-4" />
                Add test line
              </Button>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="default" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {saving ? "Saving..." : editingId ? "Update package" : "Add package"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {error && (
          <p className="rounded-md border border-error-light bg-error-light px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <ListFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title, description, or included test..."
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
          {loading ? (
            <div className="flex justify-center py-10 text-text-secondary">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="py-10 text-center text-text-secondary">
              {hasActiveFilters
                ? "No packages match your filters."
                : "No packages yet. Add your first one above."}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border p-5",
                    pkg.isFeatured
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text">{pkg.title}</h3>
                      {pkg.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeatured(pkg)}
                        disabled={togglingId === pkg._id}
                        className={cn(
                          pkg.isFeatured && "text-primary hover:text-primary"
                        )}
                        aria-label={
                          pkg.isFeatured
                            ? `Unfeature ${pkg.title}`
                            : `Feature ${pkg.title}`
                        }
                      >
                        {togglingId === pkg._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Star
                            className={cn("h-4 w-4", pkg.isFeatured && "fill-current")}
                          />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(pkg)}
                        aria-label={`Edit ${pkg.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-error hover:bg-error-light hover:text-error"
                        onClick={() => setDeleteTarget(pkg)}
                        disabled={deletingId === pkg._id}
                        aria-label={`Delete ${pkg.title}`}
                      >
                        {deletingId === pkg._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary">{pkg.description}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-text">
                      Rs {formatPrice(pkg.discountedPrice)}
                    </span>
                    <span className="text-sm text-text-secondary line-through">
                      Rs {formatPrice(pkg.originalPrice)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Included tests ({pkg.includedTests.length})
                    </span>
                    <ul className="list-inside list-disc text-sm text-text">
                      {pkg.includedTests.map((test, i) => (
                        <li key={i}>{test}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PaginationControls
            pagination={pagination}
            loading={loading}
            onPageChange={setPage}
          />
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this package?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  This will permanently remove{" "}
                  <span className="font-medium text-text">{deleteTarget.title}</span>.
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
