const DEFAULT_WHATSAPP_NUMBER = "923206913949";

export function buildWhatsAppLink(message: string): string {
  const configured = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const phone = configured || DEFAULT_WHATSAPP_NUMBER;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
