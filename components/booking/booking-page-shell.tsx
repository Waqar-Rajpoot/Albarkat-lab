// import type { LucideIcon } from "lucide-react";

// export function BookingPageShell({
//   icon: Icon,
//   title,
//   subtitle,
//   children,
// }: {
//   icon: LucideIcon;
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="bg-background-light">
//       <section className="bg-surface border-b border-border px-4 py-6 sm:py-8">
//         <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
//           <div className="flex items-center gap-2 text-navy-light">
//             <Icon className="h-5 w-5" />
//             <span className="text-xs font-medium uppercase tracking-wide">
//               Book Online
//             </span>
//           </div>
//           <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">{title}</h1>
//           <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">{subtitle}</p>
//         </div>
//       </section>

//       <section className="px-4 py-10 sm:py-14">
//         <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8">
//           {children}
//         </div>
//       </section>
//     </main>
//   );
// }








import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookingPageShell({
  icon: Icon,
  title,
  subtitle,
  children,
  maxWidth = "max-w-3xl",
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  /**
   * Tailwind max-width class for the header and content wrappers.
   * Defaults to the original max-w-3xl so Test/X-Ray/Home Sampling
   * are unaffected. Package passes a wider value to match the admin
   * packages page's card grid.
   */
  maxWidth?: string;
}) {
  return (
    <main className="bg-background-light">
      <section className="bg-surface border-b border-border px-4 py-6 sm:py-8">
        <div className={cn("mx-auto px-6 py-14 sm:py-16", maxWidth)}>
          <div className="flex items-center gap-2 text-navy-light">
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Book Online
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">{subtitle}</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14">
        <div className={cn("mx-auto rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8", maxWidth)}>
          {children}
        </div>
      </section>
    </main>
  );
}