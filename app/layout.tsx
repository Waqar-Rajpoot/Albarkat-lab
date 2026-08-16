import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PublicNavbar } from "@/components/public-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://albarkatlab.com"; // TODO: replace with your real domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AL-Barkat Lab | Diagnostic Lab Tests, X-Rays & Health Packages",
    template: "%s | AL-Barkat Lab",
  },
  description:
    "AL-Barkat Lab offers reliable diagnostic lab tests, X-ray imaging, and full health checkup packages. Book online and get accurate results from a trusted local lab.",
  keywords: [
    "AL-Barkat Lab",
    "diagnostic lab",
    "lab tests online",
    "book X-ray",
    "health checkup package",
    "pathology lab",
    "medical tests",
  ],
  authors: [{ name: "AL-Barkat Lab" }],
  applicationName: "AL-Barkat Lab",
  icons: {
    icon: "/al_barkat_logo_vector-1.svg",
    shortcut: "/al_barkat_logo_vector-1.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AL-Barkat Lab",
    title: "AL-Barkat Lab | Diagnostic Lab Tests, X-Rays & Health Packages",
    description:
      "Book lab tests, X-rays, and full health checkup packages online with AL-Barkat Lab.",
    images: [
      {
        url: "/og-image.png", // TODO: add a real 1200x630 OG image to /public
        width: 1200,
        height: 630,
        alt: "AL-Barkat Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AL-Barkat Lab | Diagnostic Lab Tests, X-Rays & Health Packages",
    description:
      "Book lab tests, X-rays, and full health checkup packages online with AL-Barkat Lab.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicNavbar />
        {children}
      </body>
    </html>
  );
}