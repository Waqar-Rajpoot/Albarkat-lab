import type { Metadata } from "next";
import { Bone } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import XRay from "@/models/XRay";
import { BookingPageShell } from "@/components/booking/booking-page-shell";
import { XRayBookingForm, type XRayOption } from "@/components/booking/xray-booking-form";

export const metadata: Metadata = {
  title: "Book an X-Ray | AL-Barkat Lab",
  description:
    "Book any digital X-Ray procedure at AL-Barkat Lab'z & Digital X-Ray — fill in your details and confirm instantly over WhatsApp.",
};

export const dynamic = "force-dynamic";

async function getXRays(): Promise<XRayOption[]> {
  await connectToDatabase();
  const xrays = await XRay.find().sort({ category: 1, procedure: 1 }).lean();

  return xrays.map((x) => ({
    _id: String(x._id),
    category: x.category,
    procedure: x.procedure,
    price: x.price,
  }));
}

export default async function BookXRayPage() {
  const xrays = await getXRays();

  return (
    <BookingPageShell
      icon={Bone}
      title="Book an X-Ray"
      subtitle="Select the X-Ray procedure(s) you need, share your details, and we'll confirm your booking over WhatsApp."
    >
      <XRayBookingForm xrays={xrays} />
    </BookingPageShell>
  );
}
