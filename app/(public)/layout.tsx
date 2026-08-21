// import { PublicNavbar } from "@/components/public-navbar";

// export default function PublicLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <PublicNavbar />
//       {children}
//     </>
//   );
// }







import { PublicNavbar } from "@/components/public-navbar";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <WhatsAppFloatButton />
    </>
  );
}