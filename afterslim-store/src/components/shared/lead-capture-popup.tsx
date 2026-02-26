"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";

const POPUP_DELAY_MS = 8000;
const POPUP_DISMISSED_KEY = "afterslim_lead_dismissed";

export function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const leadPopupShown = useUIStore((s) => s.leadPopupShown);
  const setLeadPopupShown = useUIStore((s) => s.setLeadPopupShown);

  useEffect(() => {
    if (leadPopupShown) return;

    // Check if previously dismissed
    try {
      if (localStorage.getItem(POPUP_DISMISSED_KEY)) return;
    } catch {
      // localStorage unavailable
    }

    const timer = setTimeout(() => {
      setOpen(true);
      setLeadPopupShown(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [leadPopupShown, setLeadPopupShown]);

  function handleDismiss() {
    setOpen(false);
    try {
      localStorage.setItem(POPUP_DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    // TODO: POST to /api/leads when API route is built
    await new Promise((r) => setTimeout(r, 800));

    setLoading(false);
    toast.success("Welcome! Check your email for your 10% discount code.");
    handleDismiss();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] px-6 py-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Gift className="size-7" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Get 10% Off Your First Order
            </DialogTitle>
            <DialogDescription className="mt-2 text-white/80">
              Join the AfterSlim community and start your wellness journey with
              an exclusive discount.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Claim My 10% Discount"}
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full text-center text-xs text-muted-foreground hover:underline"
          >
            No thanks, I&apos;ll pay full price
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
