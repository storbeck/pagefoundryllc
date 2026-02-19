import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/app/work/header";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mt-6">{children}</main>
    </div>
  );
}
