import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Clients from "@/components/clients";

export default async function Header() {
  const user = await requireUser();

  const clients = await prisma.client.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });
  const projects = await prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, clientId: true },
  });
  const projectsByClient = projects.reduce<
    Record<string, { id: string; name: string }[]>
  >((acc, project) => {
    if (!acc[project.clientId]) acc[project.clientId] = [];
    acc[project.clientId].push({ id: project.id, name: project.name });
    return acc;
  }, {});

  async function createClientAction(formData: FormData) {
    "use server";

    const user = await requireUser();
    const name = String(formData.get("name") || "").trim();
    const projectName = String(formData.get("projectName") || "").trim();
    if (!name) return;

    const client = await prisma.client.create({
      data: { ownerId: user.id, name },
      select: { id: true },
    });
    const project = await prisma.project.create({
      data: {
        ownerId: user.id,
        clientId: client.id,
        name: projectName || "Default Project",
      },
      select: { id: true },
    });

    revalidatePath("/work");
    redirect(`/work/${client.id}/${project.id}`);
  }

  return (
    <Clients
      clients={clients}
      projectsByClient={projectsByClient}
      createClientAction={createClientAction}
    />
  );
}
