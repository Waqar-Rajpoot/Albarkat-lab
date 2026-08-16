"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Loader2,
  Package as PackageIcon,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Package = {
  _id: string;
  title: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  includedTests: string[];
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

const priceFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "—";
  return priceFormatter.format(price);
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadPackages() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load packages");
      setPackages(data.packages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Standard fetch-on-mount pattern; loadPackages manages its own
    // loading/error state internally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPackages();
  }, []);

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
      await loadPackages();
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
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      setPackages((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) cancelEdit();
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
              <Button type="submit" variant="success" disabled={saving}>
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

        <div>
          {loading ? (
            <div className="flex justify-center py-10 text-text-secondary">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface py-10 text-center text-text-secondary shadow-sm">
              No packages yet. Add your first one above.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-text">{pkg.title}</h3>
                    <div className="flex shrink-0 gap-1">
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