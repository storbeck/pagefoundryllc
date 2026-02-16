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

function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  const clone = new Date(date);
  clone.setUTCDate(clone.getUTCDate() + days);
  return clone;
}

function isWeekday(date: Date): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6;
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

  const today = utcDay(new Date());
  const rowsByDate = new Map(
    entries.map((entry) => [
      formatWorkDate(entry.workDate),
      {
        id: entry.id,
        workDate: formatWorkDate(entry.workDate),
        hours: entry.hours.toString(),
        notes: entry.notes ?? "",
        updatedAt: entry.updatedAt.toISOString(),
        isPlaceholder: false,
      },
    ]),
  );

  const latestEntryDate = entries[0]?.workDate ? utcDay(entries[0].workDate) : null;
  if (latestEntryDate) {
    for (
      let cursor = addDays(latestEntryDate, 1);
      cursor.getTime() <= today.getTime();
      cursor = addDays(cursor, 1)
    ) {
      if (!isWeekday(cursor)) continue;
      const key = formatWorkDate(cursor);
      if (rowsByDate.has(key)) continue;
      rowsByDate.set(key, {
        id: `placeholder-${key}`,
        workDate: key,
        hours: "",
        notes: "",
        updatedAt: "",
        isPlaceholder: true,
      });
    }
  }

  const tableRows = [...rowsByDate.values()].sort((a, b) =>
    a.workDate < b.workDate ? 1 : -1,
  );

  async function saveEntryAction(formData: FormData) {
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

    const workDate = parseWorkDate(workDateText);
    if (!workDate) {
      throw new Error(`Invalid date: ${workDateText}`);
    }

    const hours = hoursText === "" ? 0 : Number(hoursText);
    if (!Number.isFinite(hours) || hours < 0) {
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
    return { saved: true };
  }

  return <WorkLogTable rows={tableRows} onSaveEntry={saveEntryAction} />;
}
