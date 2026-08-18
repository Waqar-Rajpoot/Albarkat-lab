"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog";
import type { PatientInfo } from "@/lib/patient-info";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export type HealthPackage = {
  id: string;
  title: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  includedTests: string[];
  isFeatured: boolean;
};

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export function PackagesCarousel({ packages }: { packages: HealthPackage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedPackage = packages.find((p) => p.id === selectedId) ?? null;

  function handleBookClick(pkgId: string) {
    setSelectedId(pkgId);
    setDialogOpen(true);
  }

  function handleConfirm(patient: PatientInfo) {
    if (!selectedPackage) return;

    const lines = [
      "*New Health Package Booking*",
      "",
      "*Patient Details*",
      `Name: ${patient.name}`,
      `Father/Husband Name: ${patient.guardianName}`,
      `Age: ${patient.age}`,
      "",
      "*Selected Package*",
      `${selectedPackage.title} - ${formatPKR(selectedPackage.discountedPrice)} (was ${formatPKR(selectedPackage.originalPrice)})`,
      `Includes: ${selectedPackage.includedTests.join(", ")}`,
    ];

    if (patient.reference.trim()) {
      lines.push("", `Reference: ${patient.reference.trim()}`);
    }

    lines.push("", "Please confirm this booking.");

    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
    setDialogOpen(false);
  }

  if (packages.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-sm text-text-secondary">
          No featured packages right now. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="mx-auto w-full max-w-5xl"
    >
      <CarouselContent className="-ml-4 pt-3">
        {packages.map((pkg) => {
          const discountPercent = Math.round(
            (1 - pkg.discountedPrice / pkg.originalPrice) * 100
          );

          return (
            <CarouselItem
              key={pkg.id}
              className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <div className="relative flex h-110 flex-col gap-4 rounded-lg border border-border bg-surface p-6">
                {pkg.isFeatured && (
                  <span className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-text">
                    {pkg.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {pkg.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatPKR(pkg.discountedPrice)}
                  </span>
                  {pkg.originalPrice > pkg.discountedPrice && (
                    <>
                      <span className="text-sm text-text-secondary line-through">
                        {formatPKR(pkg.originalPrice)}
                      </span>
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        {discountPercent}% off
                      </span>
                    </>
                  )}
                </div>

                <ul className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
                  {pkg.includedTests.map((test, index) => (
                    <li
                      key={`${test}-${index}`}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      <span className="capitalize">{test}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleBookClick(pkg.id)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book via WhatsApp
                </button>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="mt-6 flex items-center justify-center gap-3">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>

      <BookingDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Your Details"
        description="A few details before we send your package booking on WhatsApp."
        summary={
          selectedPackage
            ? `${selectedPackage.title} · ${formatPKR(selectedPackage.discountedPrice)}`
            : undefined
        }
        onConfirm={handleConfirm}
      />
    </Carousel>
  );
}