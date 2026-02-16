"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = ['work-log','pay-period', 'invoices'] as const
type AvailableRoutes = typeof ROUTES[number]

export default function ClientTabs({
  clientId,
  projectId,
}: {
  clientId: string;
  projectId: string;
}) {
  const pathname = usePathname()

  function active(route: AvailableRoutes): string {
    return pathname.includes(`/${route}`) ? "border-b" : ""
  }

  return (
    <nav className="flex flex-wrap gap-2 pb-3">
      {ROUTES.map((route) => (
        <Link
          key={route}
          className={`${active(route)} py-2 px-4 text-sm capitalize hover:dark:bg-neutral-800 hover:bg-neutral-50`}
          href={`/work/${clientId}/${projectId}/${route}`}
        >
          {route.replace(/-/g, " ")}
        </Link>
      ))}
    </nav>
  );
}
