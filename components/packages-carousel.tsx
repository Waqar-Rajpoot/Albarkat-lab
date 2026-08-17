"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type HealthPackage = {
  id: string;
  title: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  includedTests: string[];
  isFeatured: boolean;
};

const packages: HealthPackage[] = [
  {
    id: "6a817102bfd4f4584248a7a6",
    title: "Diabetes",
    description: "this is sugur diese",
    discountedPrice: 12000,
    originalPrice: 15000,
    includedTests: ["blood test", "blood sugur", "brain test", "eye test"],
    isFeatured: false,
  },
  {
    id: "6a817102bfd4f4094248a7a6",
    title: "Diabetes",
    description: "this is sugur diese",
    discountedPrice: 12000,
    originalPrice: 15000,
    includedTests: ["blood test", "blood sugur", "brain test", "eye test"],
    isFeatured: false,
  },
  {
    id: "6a817102bfd4f4304248a7a6",
    title: "Diabetes",
    description: "this is sugur diese",
    discountedPrice: 12000,
    originalPrice: 15000,
    includedTests: ["blood test", "blood sugur", "brain test", "eye test"],
    isFeatured: false,
  },
  {
    id: "6a817102bfd4f4534248a7a6",
    title: "Diabetes",
    description: "this is sugur diese",
    discountedPrice: 12000,
    originalPrice: 15000,
    includedTests: ["blood test", "blood sugur", "brain test", "eye test"],
    isFeatured: false,
  },
  {
    id: "6a817102bfd4f4584248a0a6",
    title: "Diabetes",
    description: "this is sugur diese",
    discountedPrice: 12000,
    originalPrice: 15000,
    includedTests: ["blood test", "blood sugur", "brain test", "eye test"],
    isFeatured: false,
  },
  // Sample placeholders — swap for real packages from your DB.
  {
    id: "sample-full-body",
    title: "Full Body Checkup",
    description: "A complete panel covering the essentials.",
    discountedPrice: 8000,
    originalPrice: 10000,
    includedTests: ["CBC", "LFT", "RFT", "Urine test"],
    isFeatured: true,
  },
  {
    id: "sample-cardiac",
    title: "Cardiac Package",
    description: "Heart-focused screening panel.",
    discountedPrice: 9500,
    originalPrice: 12000,
    includedTests: ["ECG", "Lipid profile", "Blood pressure"],
    isFeatured: false,
  },
];

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export function PackagesCarousel() {
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

                <Link
                  href="/book-package"
                  className="mt-2 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Book This Package
                </Link>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="mt-6 flex items-center justify-center gap-3">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}