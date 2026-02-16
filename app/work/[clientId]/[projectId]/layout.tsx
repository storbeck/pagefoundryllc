
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientTabs from "@/app/components/client-tabs";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string; projectId: string }>;
}) {
  const user = await requireUser();
  const { clientId, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, clientId, ownerId: user.id },
    select: { id: true },
  });

  if (!project) {
    return <div className="p-6">Project not found.</div>;
  }

  return (
    <div className="space-y-4">
      <ClientTabs clientId={clientId} projectId={projectId} />

      {children}
    </div>
  );
}
