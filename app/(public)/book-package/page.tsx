import type { Metadata } from "next";
import { Package as PackageIcon } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Package from "@/models/Package";
import { BookingPageShell } from "@/components/booking/booking-page-shell";
import {
  PackageBookingForm,
  type PackageOption,
} from "@/components/booking/package-booking-form";

export const metadata: Metadata = {
  title: "Book a Health Package | AL-Barkat Lab",
  description:
    "Book a complete health checkup package at AL-Barkat Lab'z & Digital X-Ray — fill in your details and confirm instantly over WhatsApp.",
};

export const dynamic = "force-dynamic";

async function getPackages(): Promise<PackageOption[]> {
  await connectToDatabase();
  const packages = await Package.find().sort({ isFeatured: -1, createdAt: -1 }).lean();

  return packages.map((p) => ({
    _id: String(p._id),
    title: p.title,
    description: p.description,
    discountedPrice: p.discountedPrice,
    originalPrice: p.originalPrice,
    includedTests: p.includedTests,
    isFeatured: p.isFeatured,
  }));
}

export default async function BookPackagePage() {
  const packages = await getPackages();

  return (
    <BookingPageShell
      icon={PackageIcon}
      title="Book a Health Package"
      subtitle="Choose the health package that fits you, share your details, and we'll confirm your booking over WhatsApp."
      maxWidth="max-w-5xl"
    >
      <PackageBookingForm packages={packages} />
    </BookingPageShell>
  );
}