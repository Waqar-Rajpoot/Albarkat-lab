"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Bone,
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

type XRay = {
  _id: string;
  category: string;
  procedure: string;
  price: number;
};

const emptyForm = { category: "", procedure: "", price: "" };

const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 2,
});

function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "—";
  return priceFormatter.format(price);
}

export default function AdminXRaysPage() {
  const [xrays, setXrays] = useState<XRay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<XRay | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadXrays() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/xrays");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load X-rays");
      setXrays(data.xrays);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load X-rays");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadXrays();
  }, []);

  function startEdit(xray: XRay) {
    setEditingId(xray._id);
    setForm({
      category: xray.category,
      procedure: xray.procedure,
      price: Number.isFinite(xray.price) ? String(xray.price) : "",
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
        editingId ? `/api/admin/xrays/${editingId}` : "/api/admin/xrays",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: form.category,
            procedure: form.procedure,
            price: Number(form.price),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      cancelEdit();
      await loadXrays();
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
      const res = await fetch(`/api/admin/xrays/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      setXrays((prev) => prev.filter((x) => x._id !== id));
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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <Bone className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-text">X-Ray Procedures</h1>
              <p className="text-sm text-text-secondary">
                Manage the X-ray procedures patients can be booked for.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-text">
            {editingId ? "Edit procedure" : "Add a new procedure"}
          </p>

          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_140px]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                placeholder="Chest & Respiratory"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="procedure">Procedure</Label>
              <Input
                id="procedure"
                type="text"
                placeholder="Chest X-Ray (PA View)"
                required
                value={form.procedure}
                onChange={(e) => setForm({ ...form, procedure: e.target.value })}
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
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingId ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {saving ? "Saving..." : editingId ? "Update procedure" : "Add procedure"}
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

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Category</TableHead>
                <TableHead>Procedure</TableHead>
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
              ) : xrays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-text-secondary">
                    No X-ray procedures yet. Add your first one above.
                  </TableCell>
                </TableRow>
              ) : (
                xrays.map((xray) => (
                  <TableRow key={xray._id}>
                    <TableCell className="font-medium text-text-secondary">
                      {xray.category}
                    </TableCell>
                    <TableCell>{xray.procedure}</TableCell>
                    <TableCell>{formatPrice(xray.price)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(xray)}
                          aria-label={`Edit ${xray.procedure}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-error hover:bg-error-light hover:text-error"
                          onClick={() => setDeleteTarget(xray)}
                          disabled={deletingId === xray._id}
                          aria-label={`Delete ${xray.procedure}`}
                        >
                          {deletingId === xray._id ? (
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
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this procedure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  This will permanently remove{" "}
                  <span className="font-medium text-text">
                    {deleteTarget.procedure}
                  </span>{" "}
                  ({deleteTarget.category}). This can&apos;t be undone.
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