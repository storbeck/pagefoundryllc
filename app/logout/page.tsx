"use client";

import { useEffect, useRef } from "react";
import { logoutAction } from "./actions";

export default function LogoutPage() {
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <form ref={formRef} action={logoutAction} className="space-y-3 border p-4 text-sm">
        <p>Signing you out...</p>
        <button type="submit" className="border px-3 py-2">
          Continue
        </button>
      </form>
    </main>
  );
}
