"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogFilterBar } from "@/components/booking/catalog-filter-bar";
import { ServiceSelectionList } from "@/components/booking/service-selection-list";
import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog";
import type { PatientInfo } from "@/lib/patient-info";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export type TestOption = {
  _id: string;
  testId: number;
  description: string;
  price: number;
};

export function TestBookingForm({ tests }: { tests: TestOption[] }) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter(
      (t) => t.description.toLowerCase().includes(q) || String(t.testId).includes(q)
    );
  }, [tests, search]);

  const items = useMemo(
    () =>
      filteredTests.map((t) => ({
        id: t._id,
        label: t.description,
        meta: `Test ID: ${t.testId}`,
        price: t.price,
      })),
    [filteredTests]
  );

  const selectedTests = tests.filter((t) => selectedIds.has(t._id));
  const total = selectedTests.reduce((sum, t) => sum + t.price, 0);

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
      "*New Test Booking Request*",
      "",
      "*Patient Details*",
      `Name: ${patient.name}`,
      `Father/Husband Name: ${patient.guardianName}`,
      `Age: ${patient.age}`,
      "",
      "*Test(s) Requested*",
      ...selectedTests.map(
        (t, i) => `${i + 1}. ${t.description} - Rs. ${t.price.toLocaleString()}`
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
        searchPlaceholder="Search tests by name or test ID..."
      />

      <ServiceSelectionList
        items={items}
        selectedIds={selectedIds}
        onToggle={toggle}
        emptyMessage={
          tests.length === 0
            ? "No tests available right now. Please check back later or contact us directly."
            : "No tests match your search."
        }
      />

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 shadow-md">
        <p className="text-sm text-text">
          {selectedTests.length > 0 ? (
            <>
              <span className="font-medium">{selectedTests.length}</span> selected · Rs.{" "}
              {total.toLocaleString()}
            </>
          ) : (
            "Select one or more tests to continue"
          )}
        </p>
        <Button
          type="button"
          size="lg"
          className="gap-2"
          disabled={selectedTests.length === 0}
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
        description="A few details before we send your test booking on WhatsApp."
        summary={`${selectedTests.length} test(s) selected · Rs. ${total.toLocaleString()}`}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
