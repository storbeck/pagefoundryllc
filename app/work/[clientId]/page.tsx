import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClientHome({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const user = await requireUser();
  const { clientId } = await params;

  const client = await prisma.client.findFirst({
    where: { id: clientId, ownerId: user.id },
    select: { id: true },
  });
  if (!client) return <p>Client not found.</p>;

  let project = await prisma.project.findFirst({
    where: { ownerId: user.id, clientId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        ownerId: user.id,
        clientId,
        name: "Default Project",
      },
      select: { id: true },
    });
  }

  redirect(`/work/${clientId}/${project.id}`);
}
