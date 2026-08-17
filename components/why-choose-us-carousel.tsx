"use client";

import {
  CalendarCheck,
  MapPin,
  Clock3,
  Users,
  CheckCircle2,
  ScanLine,
  HomeIcon,
  Wallet,
  Timer,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type WhyChooseUsItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const whyChooseUs: WhyChooseUsItem[] = [
  {
    icon: CalendarCheck,
    title: "Established in 1990",
    description: "Serving Abdul Hakeem for over three decades.",
  },
  {
    icon: MapPin,
    title: "First Lab in Abdul Hakeem",
    description: "Founded as New Nishtar Clinical Lab, the area's first.",
  },
  {
    icon: Clock3,
    title: "36+ Years of Service",
    description: "Trusted by generations of local families.",
  },
  {
    icon: Users,
    title: "Experienced & Qualified Staff",
    description: "Certified technicians you can rely on.",
  },
  {
    icon: CheckCircle2,
    title: "Accurate & Reliable Results",
    description: "Precision testing on modern equipment.",
  },
  {
    icon: ScanLine,
    title: "Modern Digital X-Ray",
    description: "Fast, high-quality digital imaging on-site.",
  },
  {
    icon: HomeIcon,
    title: "Home Sample Collection",
    description: "We come to you for added convenience.",
  },
  {
    icon: Wallet,
    title: "Affordable Prices",
    description: "Quality diagnostics at a fair price.",
  },
  {
    icon: Timer,
    title: "Fast Report Delivery",
    description: "Quick turnaround so you're not left waiting.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-Centered Care",
    description: "Compassionate service at every visit.",
  },
];

export function WhyChooseUsCarousel() {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="mx-auto w-full max-w-5xl"
    >
      <CarouselContent className="-ml-4">
        {whyChooseUs.map((item) => {
          const Icon = item.icon;
          return (
            <CarouselItem
              key={item.title}
              className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-6">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="text-base font-semibold text-text">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {item.description}
                </p>
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