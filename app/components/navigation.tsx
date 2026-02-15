import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full flex whitespace-nowrap gap-8 flex-row border-b text-xl font-semibold leading-10 tracking-tight">
      <Link href="/appdev">Application Development</Link>
      <Link href="/ux">UX Consulting</Link>
      <Link href="/ai">AI Readiness</Link>
    </nav>
  );
}