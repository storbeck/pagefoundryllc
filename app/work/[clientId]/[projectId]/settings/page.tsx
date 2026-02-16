import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsForms from "./settings-forms";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ clientId: string; projectId: string }>;
}) {
  const user = await requireUser();
  const { clientId, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, clientId, ownerId: user.id },
    select: {
      id: true,
      clientId: true,
      description: true,
      hourlyRate: true,
      repositoryUrl: true,
      client: {
        select: {
          id: true,
          contactName: true,
          contactEmail: true,
          addressLine1: true,
          addressLine2: true,
        },
      },
    },
  });

  if (!project) return <div className="p-6">Project not found.</div>;

  async function updateClientSettingsAction(formData: FormData) {
    "use server";

    const user = await requireUser();
    const owned = await prisma.project.findFirst({
      where: { id: projectId, clientId, ownerId: user.id },
      select: { id: true, clientId: true },
    });
    if (!owned) throw new Error("Project not found");

    const contactName = String(formData.get("contactName") || "").trim();
    const contactEmail = String(formData.get("contactEmail") || "").trim();
    const addressLine1 = String(formData.get("addressLine1") || "").trim();
    const addressLine2 = String(formData.get("addressLine2") || "").trim();

    await prisma.client.update({
      where: { id: owned.clientId },
      data: {
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
      },
    });

    revalidatePath(`/work/${clientId}/${projectId}/settings`);
    return { message: "Client settings saved." };
  }

  async function updateProjectSettingsAction(formData: FormData) {
    "use server";

    const user = await requireUser();
    const owned = await prisma.project.findFirst({
      where: { id: projectId, clientId, ownerId: user.id },
      select: { id: true },
    });
    if (!owned) throw new Error("Project not found");

    const description = String(formData.get("description") || "").trim();
    const repositoryUrl = String(formData.get("repositoryUrl") || "").trim();
    const hourlyRateText = String(formData.get("hourlyRate") || "").trim();
    const hourlyRateNumber = hourlyRateText === "" ? null : Number(hourlyRateText);

    if (
      hourlyRateNumber !== null &&
      (!Number.isFinite(hourlyRateNumber) || hourlyRateNumber < 0)
    ) {
      throw new Error("Hourly rate must be a non-negative number.");
    }

    await prisma.project.update({
      where: { id: owned.id },
      data: {
        description: description || null,
        repositoryUrl: repositoryUrl || null,
        hourlyRate:
          hourlyRateNumber === null ? null : hourlyRateNumber.toFixed(2),
      },
    });

    revalidatePath(`/work/${clientId}/${projectId}/settings`);
    revalidatePath(`/work/${clientId}/${projectId}/invoices`);
    return { message: "Project settings saved." };
  }

  return (
    <SettingsForms
      client={{
        contactName: project.client.contactName ?? "",
        contactEmail: project.client.contactEmail ?? "",
        addressLine1: project.client.addressLine1 ?? "",
        addressLine2: project.client.addressLine2 ?? "",
      }}
      project={{
        description: project.description ?? "",
        hourlyRate:
          project.hourlyRate != null ? project.hourlyRate.toString() : "",
        repositoryUrl: project.repositoryUrl ?? "",
      }}
      onSaveClient={updateClientSettingsAction}
      onSaveProject={updateProjectSettingsAction}
    />
  );
}
