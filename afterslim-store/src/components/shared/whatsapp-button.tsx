"use client";

import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
}

export function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const phoneNumber = CONTACT.whatsapp;

  // Don't render if no WhatsApp number is configured
  if (!phoneNumber) return null;

  const message = encodeURIComponent(
    "Hi! I'm interested in AfterSlim products. Can you help me?",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        className,
      )}
    >
      <MessageCircle className="size-7" fill="currentColor" />
    </a>
  );
}
