"use client";

import { useEffect } from "react";

type FloatingMessageProps = {
  message: string;
  visible: boolean;
  tone?: "success" | "error";
  onClose: () => void;
};

export default function FloatingMessage({
  message,
  visible,
  tone = "success",
  onClose,
}: FloatingMessageProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => onClose(), 2600);
    return () => window.clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <div
      className={[
        "pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-200",
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      ].join(" ")}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={[
          "pointer-events-auto border px-4 py-2 text-sm shadow-lg",
          tone === "success"
            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
            : "border-red-300 bg-red-50 text-red-900",
        ].join(" ")}
      >
        {message}
      </div>
    </div>
  );
}
