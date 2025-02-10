"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "gday@fairdinkumsystems.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      <div>{email}</div>
      <Button
        variant="outline"
        size="icon"
        onClick={copyEmail}
        className={copied ? "bg-green-100" : ""}
      >
        <ClipboardCopy className="h-4 w-4" />
      </Button>
    </div>
  );
}
