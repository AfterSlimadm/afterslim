"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    // TODO: Wire up to Supabase leads table or email service
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "loading"}
        className="h-10 flex-1"
        aria-label="Email address for newsletter"
      />
      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="h-10 shrink-0"
      >
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : status === "success" ? (
          "Subscribed!"
        ) : (
          <>
            <Send className="size-4" />
            <span className="sr-only sm:not-sr-only">Subscribe</span>
          </>
        )}
      </Button>
    </form>
  );
}
