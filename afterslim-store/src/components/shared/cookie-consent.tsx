"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "afterslim_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(COOKIE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-4 rounded-xl border bg-card p-4 shadow-lg sm:p-5">
        <Cookie className="hidden size-6 flex-shrink-0 text-primary sm:block" />
        <p className="flex-1 text-sm text-muted-foreground">
          We use cookies to enhance your experience. By continuing to browse,
          you agree to our{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
        <Button size="sm" onClick={accept}>
          Accept
        </Button>
      </div>
    </div>
  );
}
