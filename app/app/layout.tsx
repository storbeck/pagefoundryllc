import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between">
        <nav className="flex gap-3 text-sm">
          <Link href="/app/clients">Clients</Link>
          <Link href="/app/projects">Projects</Link>
          <Link href="/app/log">Daily Log</Link>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
