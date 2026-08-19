"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  FlaskConical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ListFilters } from "@/components/admin/list-filters";
import { PaginationControls, type Pagination } from "@/components/admin/pagination-controls";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Test = {
  _id: string;
  testId: number;
  description: string;
  price: number;
};

const emptyForm = { testId: "", description: "", price: "" };

const PAGE_SIZE = 10;

const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 2,
});

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "—";
  return priceFormatter.format(price);
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
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

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Test | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadTests(targetPage: number) {
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

      const res = await fetch(`/api/admin/tests?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load tests");
      setTests(data.tests);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tests");
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
    loadTests(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, debouncedMinPrice, debouncedMaxPrice]);

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
  }

  function startEdit(test: Test) {
    setEditingId(test._id);
    setForm({
      testId: String(test.testId),
      description: test.description,
      price: Number.isFinite(test.price) ? String(test.price) : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(
        editingId ? `/api/admin/tests/${editingId}` : "/api/admin/tests",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testId: Number(form.testId),
            description: form.description,
            price: Number(form.price),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      cancelEdit();
      await loadTests(editingId ? page : 1);
      if (!editingId) setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget._id;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tests/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      if (editingId === id) cancelEdit();

      // If this was the last row on a page beyond the first, step back a
      // page and let the effect re-fetch — otherwise just refresh in place.
      const isLastRowOnPage = tests.length === 1 && page > 1;
      if (isLastRowOnPage) {
        setPage((p) => p - 1);
      } else {
        await loadTests(page);
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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-text">Lab Tests</h1>
              <p className="text-sm text-text-secondary">
                Manage the tests patients can be booked for.
                {pagination ? ` ${pagination.total} total.` : ""}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-text">
            {editingId ? "Edit test" : "Add a new test"}
          </p>

          <div className="grid gap-4 sm:grid-cols-[140px_1fr_140px]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="testId">Test ID</Label>
              <Input
                id="testId"
                type="number"
                placeholder="106"
                required
                value={form.testId}
                onChange={(e) => setForm({ ...form, testId: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="A/G Ratio"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price (PKR)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="1500"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
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
              {saving ? "Saving..." : editingId ? "Update test" : "Add test"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>

        {error && (
          <p className="rounded-md border border-error-light bg-error-light px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <ListFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by description or test ID..."
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Test ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-32">Price</TableHead>
                <TableHead className="w-36 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-text-secondary">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : tests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-text-secondary">
                    {hasActiveFilters
                      ? "No tests match your filters."
                      : "No tests yet. Add your first one above."}
                  </TableCell>
                </TableRow>
              ) : (
                tests.map((test) => (
                  <TableRow key={test._id}>
                    <TableCell className="font-medium text-text-secondary">
                      {test.testId}
                    </TableCell>
                    <TableCell>{test.description}</TableCell>
                    <TableCell>{formatPrice(test.price)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(test)}
                          aria-label={`Edit ${test.description}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-error hover:bg-error-light hover:text-error"
                          onClick={() => setDeleteTarget(test)}
                          disabled={deletingId === test._id}
                          aria-label={`Delete ${test.description}`}
                        >
                          {deletingId === test._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

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
            <AlertDialogTitle>Delete this test?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  This will permanently remove{" "}
                  <span className="font-medium text-text">
                    {deleteTarget.description}
                  </span>{" "}
                  (Test ID {deleteTarget.testId}). This can&apos;t be undone.
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
