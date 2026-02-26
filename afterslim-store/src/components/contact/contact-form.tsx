"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "orders", label: "Orders" },
  { value: "returns", label: "Returns & Refunds" },
  { value: "wholesale", label: "Wholesale" },
  { value: "other", label: "Other" },
] as const;

export function ContactForm() {
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    // Simulate a short delay
    setTimeout(() => {
      setPending(false);
      toast.success(
        "Message sent! We'll get back to you within 24 hours."
      );
      (e.target as HTMLFormElement).reset();
    }, 800);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Your full name"
          required
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <Select name="subject" required>
          <SelectTrigger id="subject" className="w-full">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="How can we help you?"
          className={cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "resize-y"
          )}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
