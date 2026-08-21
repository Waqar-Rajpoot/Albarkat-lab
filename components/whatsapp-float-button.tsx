"use client";

import { MessageCircle, Phone } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const GREETING = "Hi! I have a question about AL-Barkat Lab's services.";
const PHONE_NUMBER = "+923428312028";

export function WhatsAppFloatButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-4 sm:bottom-6 sm:right-6">
      <a
        href={`tel:${PHONE_NUMBER}`}
        aria-label="Call AL-Barkat Lab"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-10 sm:w-10"
      >
        <Phone className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" strokeWidth={0} />
      </a>

      <a
        href={buildWhatsAppLink(GREETING)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:h-10 sm:w-10"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" strokeWidth={0} />
      </a>
    </div>
  );
}