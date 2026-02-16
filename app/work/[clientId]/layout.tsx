import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const user = await requireUser();
  const { clientId } = await params;

  // validate ownership + get list for dropdown
  const [client] = await Promise.all([
    prisma.client.findFirst({
      where: { id: clientId, ownerId: user.id },
      select: { id: true, name: true },
    }),
    prisma.client.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!client) {
    return <div className="p-6">Client not found.</div>;
  }

  return (
    <div>
      {children}
    </div>
  );
}
