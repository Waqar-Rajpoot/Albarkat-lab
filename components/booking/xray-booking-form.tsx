"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogFilterBar } from "@/components/booking/catalog-filter-bar";
import { ServiceSelectionList } from "@/components/booking/service-selection-list";
import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog";
import type { PatientInfo } from "@/lib/patient-info";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export type XRayOption = {
  _id: string;
  category: string;
  procedure: string;
  price: number;
};

export function XRayBookingForm({ xrays }: { xrays: XRayOption[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(xrays.map((x) => x.category))).sort(),
    [xrays]
  );

  const filteredXRays = useMemo(() => {
    const q = search.trim().toLowerCase();
    return xrays.filter((x) => {
      const matchesCategory = !category || x.category === category;
      const matchesSearch =
        !q || x.procedure.toLowerCase().includes(q) || x.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [xrays, search, category]);

  const items = useMemo(
    () =>
      filteredXRays.map((x) => ({
        id: x._id,
        label: x.procedure,
        meta: `Category: ${x.category}`,
        price: x.price,
      })),
    [filteredXRays]
  );

  const selectedXRays = xrays.filter((x) => selectedIds.has(x._id));
  const total = selectedXRays.reduce((sum, x) => sum + x.price, 0);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm(patient: PatientInfo) {
    const lines = [
      "*New X-Ray Booking Request*",
      "",
      "*Patient Details*",
      `Name: ${patient.name}`,
      `Father/Husband Name: ${patient.guardianName}`,
      `Age: ${patient.age}`,
      "",
      "*X-Ray(s) Requested*",
      ...selectedXRays.map(
        (x, i) => `${i + 1}. ${x.procedure} (${x.category}) - Rs. ${x.price.toLocaleString()}`
      ),
      "",
      `*Total: Rs. ${total.toLocaleString()}*`,
    ];

    if (patient.reference.trim()) {
      lines.push("", `Reference: ${patient.reference.trim()}`);
    }

    lines.push("", "Please confirm this booking.");

    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
    setDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <CatalogFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search X-Rays by name or category..."
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      <ServiceSelectionList
        items={items}
        selectedIds={selectedIds}
        onToggle={toggle}
        emptyMessage={
          xrays.length === 0
            ? "No X-Ray procedures available right now. Please check back later or contact us directly."
            : "No X-Rays match your search."
        }
      />

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 shadow-md">
        <p className="text-sm text-text">
          {selectedXRays.length > 0 ? (
            <>
              <span className="font-medium">{selectedXRays.length}</span> selected · Rs.{" "}
              {total.toLocaleString()}
            </>
          ) : (
            "Select one or more X-Rays to continue"
          )}
        </p>
        <Button
          type="button"
          size="lg"
          className="gap-2"
          disabled={selectedXRays.length === 0}
          onClick={() => setDialogOpen(true)}
        >
          <MessageCircle className="h-4 w-4" />
          Book via WhatsApp
        </Button>
      </div>

      <BookingDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Your Details"
        description="A few details before we send your X-Ray booking on WhatsApp."
        summary={`${selectedXRays.length} X-Ray(s) selected · Rs. ${total.toLocaleString()}`}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
