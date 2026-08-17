import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { SVGProps } from "react";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.83-5.97 6.83H1.66l7.73-8.84L1.25 2.25h6.83l4.72 6.24zm-1.16 17.52h1.83L7.02 4.13H5.06z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/book-test", label: "Book a Test" },
  { href: "/book-xray", label: "Book an X-Ray" },
  { href: "/book-package", label: "Book a Package" },
];

const services = [
  { href: "/book-test", label: "Lab Tests" },
  { href: "/book-xray", label: "X-Ray Imaging" },
  { href: "/book-package", label: "Health Packages" },
  { href: "/home-sampling", label: "Home Sampling" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/share/1Bez6mXkJN/",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://www.instagram.com/albarkat_lab_xray?igsh=MWp4dGl5cmJlM29pNA==",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://x.com/AlBarkatLab1990",
    label: "X (Twitter)",
    icon: XIcon,
  },
  {
    href: "https://www.linkedin.com/in/al-barkat-lab-digital-x-ray-9056a642a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

const mapAddress =
  "Al-Barkat Lab'z & Digital X-Ray, Multan Rd, opposite Dr. Tahir Gujjar Clinic, Abdul Hakīm, 58180, Pakistan";
const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  mapAddress
)}&output=embed`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              AL-Barkat Lab&apos;z &amp; Digital X-Ray
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Trusted Diagnostics, Close to Home
            </p>
            <p className="mt-4 text-xs font-medium text-white/60">
              Est. 1990 &middot; First Lab in Abdul Hakeem &middot; 36+ Years
              of Service
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white">Services</h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                <span className="text-sm text-white/70">
                  Multan Rd, opposite Dr. Tahir Gujjar Clinic, Abdul Hakīm,
                  58180, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-white" />
                <a
                  href="tel:+923360069828"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  +92336-0069828
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white" />
                <a
                  href="mailto:albarkatlabdigitalxray@gmail.com"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  albarkatlabdigitalxray@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                <span className="text-sm text-white/70">
                  Mon &ndash; Sat: 8:00 AM &ndash; 10:00 PM
                  <br />
                  Sunday: 9:00 AM &ndash; 5:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <h4 className="text-sm font-semibold text-white">Find Us</h4>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/15">
            <iframe
              src={mapEmbedSrc}
              title="AL-Barkat Lab'z & Digital X-Ray location"
              width="100%"
              height="280"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <p className="text-center text-xs text-white/60">
            &copy; {year} AL-Barkat Lab&apos;z &amp; Digital X-Ray. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}