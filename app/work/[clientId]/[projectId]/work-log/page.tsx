import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WorkLogTable from "./work-log-table";

function parseWorkDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatWorkDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function WorkLogPage({
  params,
}: {
  params: Promise<{ clientId: string; projectId: string }>;
}) {
  const user = await requireUser();
  const { clientId, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, clientId, ownerId: user.id },
    select: { id: true },
  });
  if (!project) return <div className="p-6">Project not found.</div>;

  const entries = await prisma.dailyLogEntry.findMany({
    where: { projectId },
    orderBy: { workDate: "desc" },
    select: { id: true, workDate: true, hours: true, notes: true, updatedAt: true },
  });

  const tableRows = entries.map((entry) => ({
    id: entry.id,
    workDate: formatWorkDate(entry.workDate),
    hours: entry.hours.toString(),
    notes: entry.notes ?? "",
    updatedAt: entry.updatedAt.toISOString(),
  }));

  async function createEntryAction(formData: FormData) {
    "use server";

    const user = await requireUser();
    const project = await prisma.project.findFirst({
      where: { id: projectId, clientId, ownerId: user.id },
      select: { id: true },
    });
    if (!project) {
      throw new Error("Project not found");
    }

    const workDateText = String(formData.get("workDate") || "").trim();
    const hoursText = String(formData.get("hours") || "").trim();
    const notesText = String(formData.get("notes") || "").trim();

    if (!workDateText || !hoursText) {
      throw new Error("Date and hours are required.");
    }

    const workDate = parseWorkDate(workDateText);
    if (!workDate) {
      throw new Error(`Invalid date: ${workDateText}`);
    }

    const hours = Number(hoursText);
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error(`Invalid hours: ${hoursText}`);
    }

    await prisma.dailyLogEntry.upsert({
      where: { projectId_workDate: { projectId, workDate } },
      create: {
        projectId,
        workDate,
        hours: hours.toFixed(2),
        notes: notesText || null,
      },
      update: {
        hours: hours.toFixed(2),
        notes: notesText || null,
      },
    });

    revalidatePath(`/work/${clientId}/${projectId}/work-log`);
  }

  return <WorkLogTable rows={tableRows} onCreateEntry={createEntryAction} />;
}
