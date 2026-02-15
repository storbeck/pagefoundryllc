import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full flex whitespace-nowrap md:gap-8 md:flex-row flex-col border-b text-xl font-semibold leading-7 md:leading-10">
      <Link href="/appdev">Application Development</Link>
      <Link href="/ux">UX Consulting</Link>
      <Link href="/ai">AI Readiness</Link>
    </nav>
  );
}