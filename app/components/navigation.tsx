"use server"

import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function Navigation() {
  const user = await getCurrentUser()

  return (
    <nav className="flex w-full flex-wrap gap-x-5 gap-y-2 border-b pb-2 text-base font-semibold leading-7 sm:text-lg md:gap-8 md:pb-0 md:text-xl md:leading-10">
      <Link href="/appdev">Development</Link>
      <Link href="/ux">UX Consulting</Link>
      <Link href="/ai">AI Readiness</Link>
      <Link href="/startups">Micro Startups</Link>
      <div className="flex-1" />
      {user ? (
        <Link href="/logout">Logout</Link>
      ) : null}
    </nav>
  );
}
