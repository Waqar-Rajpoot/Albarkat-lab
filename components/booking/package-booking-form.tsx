// "use client";

// import { useMemo, useState } from "react";
// import { MessageCircle, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { CatalogFilterBar } from "@/components/booking/catalog-filter-bar";
// import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog";
// import type { PatientInfo } from "@/lib/patient-info";
// import { buildWhatsAppLink } from "@/lib/whatsapp";
// import { cn } from "@/lib/utils";

// export type PackageOption = {
//   _id: string;
//   title: string;
//   description: string;
//   discountedPrice: number;
//   originalPrice: number;
//   includedTests: string[];
//   isFeatured: boolean;
// };

// export function PackageBookingForm({ packages }: { packages: PackageOption[] }) {
//   const [search, setSearch] = useState("");
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const filteredPackages = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return packages;
//     return packages.filter(
//       (p) =>
//         p.title.toLowerCase().includes(q) ||
//         p.description.toLowerCase().includes(q) ||
//         p.includedTests.some((t) => t.toLowerCase().includes(q))
//     );
//   }, [packages, search]);

//   const selectedPackage = packages.find((p) => p._id === selectedId) ?? null;

//   function handleConfirm(patient: PatientInfo) {
//     if (!selectedPackage) return;

//     const lines = [
//       "*New Health Package Booking*",
//       "",
//       "*Patient Details*",
//       `Name: ${patient.name}`,
//       `Father/Husband Name: ${patient.guardianName}`,
//       `Age: ${patient.age}`,
//       "",
//       "*Selected Package*",
//       `${selectedPackage.title} - Rs. ${selectedPackage.discountedPrice.toLocaleString()} (was Rs. ${selectedPackage.originalPrice.toLocaleString()})`,
//       `Includes: ${selectedPackage.includedTests.join(", ")}`,
//     ];

//     if (patient.reference.trim()) {
//       lines.push("", `Reference: ${patient.reference.trim()}`);
//     }

//     lines.push("", "Please confirm this booking.");

//     window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
//     setDialogOpen(false);
//   }

//   return (
//     <div className="flex flex-col gap-5">
//       <CatalogFilterBar
//         search={search}
//         onSearchChange={setSearch}
//         searchPlaceholder="Search packages by name or included test..."
//       />

//       {filteredPackages.length === 0 ? (
//         <p className="rounded-md border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-text-secondary">
//           {packages.length === 0
//             ? "No packages available right now. Please check back later or contact us directly."
//             : "No packages match your search."}
//         </p>
//       ) : (
//         <div className="grid max-h-[32rem] gap-3 overflow-y-auto rounded-md border border-border bg-background-light p-2 sm:grid-cols-2">
//           {filteredPackages.map((pkg) => {
//             const checked = pkg._id === selectedId;
//             return (
//               <label
//                 key={pkg._id}
//                 className={cn(
//                   "relative flex cursor-pointer flex-col gap-2 rounded-lg border bg-surface p-4 text-sm transition-colors",
//                   checked
//                     ? "border-secondary ring-2 ring-secondary/20"
//                     : "border-border hover:border-navy-light"
//                 )}
//               >
//                 <input
//                   type="radio"
//                   name="package"
//                   className="absolute right-4 top-4 h-4 w-4 accent-secondary"
//                   checked={checked}
//                   onChange={() => setSelectedId(pkg._id)}
//                 />
//                 <div className="flex items-center gap-2 pr-6">
//                   <p className="font-semibold text-text">{pkg.title}</p>
//                   {pkg.isFeatured && (
//                     <span className="flex items-center gap-1 rounded-full bg-warning-light px-2 py-0.5 text-[11px] font-medium text-warning">
//                       <Star className="h-3 w-3" /> Featured
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-text-secondary">{pkg.description}</p>
//                 <ul className="flex flex-wrap gap-1.5">
//                   {pkg.includedTests.map((t) => (
//                     <li
//                       key={t}
//                       className="rounded-full bg-background-light px-2 py-0.5 text-xs text-text-secondary"
//                     >
//                       {t}
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="mt-1 flex items-baseline gap-2">
//                   <span className="text-lg font-bold text-primary">
//                     Rs. {pkg.discountedPrice.toLocaleString()}
//                   </span>
//                   {pkg.originalPrice > pkg.discountedPrice && (
//                     <span className="text-xs text-text-secondary line-through">
//                       Rs. {pkg.originalPrice.toLocaleString()}
//                     </span>
//                   )}
//                 </div>
//               </label>
//             );
//           })}
//         </div>
//       )}

//       <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 shadow-md">
//         <p className="text-sm text-text">
//           {selectedPackage ? (
//             <>
//               <span className="font-medium">{selectedPackage.title}</span> · Rs.{" "}
//               {selectedPackage.discountedPrice.toLocaleString()}
//             </>
//           ) : (
//             "Select a package to continue"
//           )}
//         </p>
//         <Button
//           type="button"
//           size="lg"
//           className="gap-2"
//           disabled={!selectedPackage}
//           onClick={() => setDialogOpen(true)}
//         >
//           <MessageCircle className="h-4 w-4" />
//           Book via WhatsApp
//         </Button>
//       </div>

//       <BookingDetailsDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         title="Confirm Your Details"
//         description="A few details before we send your package booking on WhatsApp."
//         summary={
//           selectedPackage
//             ? `${selectedPackage.title} · Rs. ${selectedPackage.discountedPrice.toLocaleString()}`
//             : undefined
//         }
//         onConfirm={handleConfirm}
//       />
//     </div>
//   );
// }









"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogFilterBar } from "@/components/booking/catalog-filter-bar";
import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog";
import type { PatientInfo } from "@/lib/patient-info";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type PackageOption = {
  _id: string;
  title: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  includedTests: string[];
  isFeatured: boolean;
};

export function PackageBookingForm({ packages }: { packages: PackageOption[] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPackages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.includedTests.some((t) => t.toLowerCase().includes(q))
    );
  }, [packages, search]);

  const selectedPackage = packages.find((p) => p._id === selectedId) ?? null;

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
      `${selectedPackage.title} - Rs. ${selectedPackage.discountedPrice.toLocaleString()} (was Rs. ${selectedPackage.originalPrice.toLocaleString()})`,
      `Includes: ${selectedPackage.includedTests.join(", ")}`,
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
        searchPlaceholder="Search packages by name or included test..."
      />

      {filteredPackages.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-text-secondary">
          {packages.length === 0
            ? "No packages available right now. Please check back later or contact us directly."
            : "No packages match your search."}
        </p>
      ) : (
        <div className="grid max-h-[32rem] gap-3 overflow-y-auto rounded-md border border-border bg-background-light p-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => {
            const checked = pkg._id === selectedId;
            return (
              <label
                key={pkg._id}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-2 rounded-lg border bg-surface p-4 text-sm transition-colors",
                  checked
                    ? "border-secondary ring-2 ring-secondary/20"
                    : "border-border hover:border-navy-light"
                )}
              >
                <input
                  type="radio"
                  name="package"
                  className="absolute right-4 top-4 h-4 w-4 accent-secondary"
                  checked={checked}
                  onChange={() => setSelectedId(pkg._id)}
                />
                <div className="flex items-center gap-2 pr-6">
                  <p className="font-semibold text-text">{pkg.title}</p>
                  {pkg.isFeatured && (
                    <span className="flex items-center gap-1 rounded-full bg-warning-light px-2 py-0.5 text-[11px] font-medium text-warning">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                </div>
                <p className="text-text-secondary">{pkg.description}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {pkg.includedTests.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-background-light px-2 py-0.5 text-xs text-text-secondary"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    Rs. {pkg.discountedPrice.toLocaleString()}
                  </span>
                  {pkg.originalPrice > pkg.discountedPrice && (
                    <span className="text-xs text-text-secondary line-through">
                      Rs. {pkg.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 shadow-md">
        <p className="text-sm text-text">
          {selectedPackage ? (
            <>
              <span className="font-medium">{selectedPackage.title}</span> · Rs.{" "}
              {selectedPackage.discountedPrice.toLocaleString()}
            </>
          ) : (
            "Select a package to continue"
          )}
        </p>
        <Button
          type="button"
          size="lg"
          className="gap-2"
          disabled={!selectedPackage}
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
        description="A few details before we send your package booking on WhatsApp."
        summary={
          selectedPackage
            ? `${selectedPackage.title} · Rs. ${selectedPackage.discountedPrice.toLocaleString()}`
            : undefined
        }
        onConfirm={handleConfirm}
      />
    </div>
  );
}