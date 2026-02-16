"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = [
  { route: "work-log", label: "Work Log" },
  { route: "invoices", label: "Invoices" },
  { route: "settings", label: "Settings" },
] as const;
type AvailableRoute = (typeof ROUTES)[number]["route"];

export default function ClientTabs({
  clientId,
  projectId,
}: {
  clientId: string;
  projectId: string;
}) {
  const pathname = usePathname()

function active(route: AvailableRoute): string {
    return pathname.includes(`/${route}`) ? "border-b" : ""
  }

  return (
    <nav className="flex flex-wrap gap-2 pb-3">
      {ROUTES.map(({ route, label }) => (
        <Link
          key={route}
          className={`${active(route)} py-2 px-4 text-sm capitalize hover:dark:bg-neutral-800 hover:bg-neutral-50`}
          href={`/work/${clientId}/${projectId}/${route}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
