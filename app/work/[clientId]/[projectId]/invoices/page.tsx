import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InvoicesTable, { type InvoiceRow } from "./invoices-table";

const DEFAULT_RATE = 100;

function utcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

function parseYmd(value: string): Date | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  const ts = utcDay(date).getTime();
  return ts >= utcDay(start).getTime() && ts <= utcDay(end).getTime();
}

function toUtcYmd(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function parseInvoiceNumber(value: string): number | null {
  const match = value.match(/^PF-(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
}

function nextInvoiceNumber(existing: string[]): string {
  const max = existing.reduce((best, value) => {
    const n = parseInvoiceNumber(value);
    if (n == null) return best;
    return Math.max(best, n);
  }, 0);
  return `PF-${String(max + 1).padStart(3, "0")}`;
}

export default async function InvoicesPage({
  params,
}: {
  params: Promise<{ clientId: string; projectId: string }>;
}) {
  const user = await requireUser();
  const { clientId, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId, clientId, ownerId: user.id },
    select: { id: true, hourlyRate: true },
  });
  if (!project) return <div className="p-6">Project not found.</div>;

  const [payPeriods, entries, existingInvoiceNos] = await Promise.all([
    prisma.payPeriod.findMany({
      where: { projectId },
      orderBy: { startDate: "desc" },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNo: true,
            status: true,
            sentAt: true,
            paidAt: true,
            notes: true,
            hourlyRate: true,
            totalHours: true,
            totalAmount: true,
          },
        },
      },
    }),
    prisma.dailyLogEntry.findMany({
      where: { projectId },
      select: {
        id: true,
        workDate: true,
        hours: true,
        notes: true,
        invoiceId: true,
      },
      orderBy: { workDate: "asc" },
    }),
    prisma.invoice.findMany({
      where: { clientId },
      select: { invoiceNo: true },
    }),
  ]);
  const unclaimedEntries = entries.filter((entry) => !entry.invoiceId);

  const rows: InvoiceRow[] = payPeriods
    .filter((period) => Boolean(period.invoice))
    .map((period) => {
    const rate =
      project.hourlyRate != null ? Number(project.hourlyRate) : DEFAULT_RATE;
    const linkedEntries = period.invoice
      ? entries.filter((entry) => entry.invoiceId === period.invoice?.id)
      : [];
    // Prefer explicit invoice-linked entries; fallback to legacy date-range behavior.
    const hours = linkedEntries.length
      ? linkedEntries.reduce((sum, entry) => sum + Number(entry.hours), 0)
      : entries.reduce((sum, entry) => {
          if (!isInRange(entry.workDate, period.startDate, period.endDate))
            return sum;
          return sum + Number(entry.hours);
        }, 0);
    const amount = hours * rate;

      return {
      payPeriodId: period.id,
      invoiceId: period.invoice?.id ?? "",
      detailHref: `/work/${clientId}/${projectId}/invoices/${period.invoice?.id ?? ""}`,
      periodStart: formatDate(period.startDate),
      periodEnd: formatDate(period.endDate),
      invoiceNo: period.invoice?.invoiceNo ?? "",
      status: period.invoice?.status ?? "DRAFT",
      hours: hours.toFixed(2),
      rate: formatMoney(rate),
      amount: formatMoney(amount),
      sentAt: formatDate(period.invoice?.sentAt),
      paidAt: formatDate(period.invoice?.paidAt),
      notes: period.invoice?.notes ?? "",
      isPrepared: false,
      };
    });

  const nextInvoiceNo = nextInvoiceNumber(existingInvoiceNos.map((row) => row.invoiceNo));
  const preparedRow: InvoiceRow | null =
    unclaimedEntries.length > 0
      ? {
          payPeriodId: "prepared",
          invoiceId: "",
          detailHref: "",
          periodStart: toUtcYmd(unclaimedEntries[0].workDate),
          periodEnd: toUtcYmd(unclaimedEntries[unclaimedEntries.length - 1].workDate),
          invoiceNo: nextInvoiceNo,
          status: "DRAFT",
          hours: unclaimedEntries
            .reduce((sum, entry) => sum + Number(entry.hours), 0)
            .toFixed(2),
          rate: formatMoney(
            project.hourlyRate != null ? Number(project.hourlyRate) : DEFAULT_RATE,
          ),
          amount: formatMoney(
            unclaimedEntries.reduce((sum, entry) => sum + Number(entry.hours), 0) *
              (project.hourlyRate != null ? Number(project.hourlyRate) : DEFAULT_RATE),
          ),
          sentAt: "",
          paidAt: "",
          notes: `${unclaimedEntries.length} unclaimed work-log entr${
            unclaimedEntries.length === 1 ? "y" : "ies"
          }`,
          isPrepared: true,
          unclaimedEntries: unclaimedEntries.map((entry) => ({
            id: entry.id,
            workDate: toUtcYmd(entry.workDate),
            hours: Number(entry.hours).toFixed(2),
            notes: entry.notes ?? "",
          })),
        }
      : null;

  const tableRows = preparedRow ? [preparedRow, ...rows] : rows;

  async function updateInvoiceAction(formData: FormData) {
    "use server";

    const user = await requireUser();
    const payPeriodId = String(formData.get("payPeriodId") || "");
    const invoiceId = String(formData.get("invoiceId") || "");
    const status = String(formData.get("status") || "") as
      | "DRAFT"
      | "VOID"
      | "SENT"
      | "PAID";
    const periodStart = String(formData.get("periodStart") || "");
    const periodEnd = String(formData.get("periodEnd") || "");
    const sentAtText = String(formData.get("sentAt") || "");
    const paidAtText = String(formData.get("paidAt") || "");
    const notes = String(formData.get("notes") || "").trim();

    const ownedPeriod = await prisma.payPeriod.findFirst({
      where: { id: payPeriodId, projectId, project: { ownerId: user.id, clientId } },
      select: { id: true },
    });
    if (!ownedPeriod) throw new Error("Pay period not found.");

    const startDate = parseYmd(periodStart);
    const endDate = parseYmd(periodEnd);
    if (!startDate || !endDate) throw new Error("Invalid period date.");
    if (endDate.getTime() < startDate.getTime()) {
      throw new Error("End date cannot be before start date.");
    }
    if (!["DRAFT", "VOID", "SENT", "PAID"].includes(status)) {
      throw new Error("Invalid invoice status.");
    }

    await prisma.payPeriod.update({
      where: { id: payPeriodId },
      data: { startDate, endDate },
    });

    if (invoiceId) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status,
          sentAt: parseYmd(sentAtText),
          paidAt: parseYmd(paidAtText),
          notes: notes || null,
        },
      });
    }

    revalidatePath(`/work/${clientId}/${projectId}/invoices`);
    revalidatePath(`/work/${clientId}/${projectId}/pay-period`);
    return { message: "Invoice updated." };
  }

  async function createInvoiceFromEntriesAction(formData: FormData) {
    "use server";

    const user = await requireUser();
    const ownedProject = await prisma.project.findFirst({
      where: { id: projectId, clientId, ownerId: user.id },
      select: { id: true, clientId: true, hourlyRate: true },
    });
    if (!ownedProject) throw new Error("Project not found.");

    const entryIds = formData
      .getAll("entryIds")
      .map((value) => String(value))
      .filter(Boolean);

    if (entryIds.length === 0) {
      throw new Error("Select at least one unclaimed work-log row.");
    }

    const selectedEntries = await prisma.dailyLogEntry.findMany({
      where: {
        id: { in: entryIds },
        projectId,
        invoiceId: null,
      },
      select: { id: true, workDate: true, hours: true },
      orderBy: { workDate: "asc" },
    });

    if (selectedEntries.length === 0) {
      throw new Error("No unclaimed rows available to invoice.");
    }
    if (selectedEntries.length !== entryIds.length) {
      throw new Error("Some selected rows were already claimed. Refresh and try again.");
    }

    const startDate = utcDay(selectedEntries[0].workDate);
    const endDate = utcDay(selectedEntries[selectedEntries.length - 1].workDate);
    const rate =
      ownedProject.hourlyRate != null
        ? Number(ownedProject.hourlyRate)
        : DEFAULT_RATE;
    const totalHours = selectedEntries.reduce(
      (sum, entry) => sum + Number(entry.hours),
      0,
    );
    const totalAmount = totalHours * rate;

    const existingPeriod = await prisma.payPeriod.findUnique({
      where: {
        projectId_startDate_endDate: { projectId, startDate, endDate },
      },
      select: { id: true, invoice: { select: { id: true } } },
    });
    if (existingPeriod?.invoice) {
      throw new Error("An invoice already exists for this exact period.");
    }

    const payPeriod = existingPeriod
      ? await prisma.payPeriod.update({
          where: { id: existingPeriod.id },
          data: {
            hourlyRate: rate.toFixed(2),
            totalHours: totalHours.toFixed(2),
          },
          select: { id: true },
        })
      : await prisma.payPeriod.create({
          data: {
            projectId,
            startDate,
            endDate,
            hourlyRate: rate.toFixed(2),
            totalHours: totalHours.toFixed(2),
          },
          select: { id: true },
        });

    const invoiceNos = await prisma.invoice.findMany({
      where: { clientId: ownedProject.clientId },
      select: { invoiceNo: true },
    });
    const invoiceNo = nextInvoiceNumber(invoiceNos.map((row) => row.invoiceNo));

    const invoice = await prisma.invoice.create({
      data: {
        clientId: ownedProject.clientId,
        projectId,
        payPeriodId: payPeriod.id,
        invoiceNo,
        status: "DRAFT",
        hourlyRate: rate.toFixed(2),
        totalHours: totalHours.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      },
      select: { id: true, invoiceNo: true },
    });

    await prisma.dailyLogEntry.updateMany({
      where: { id: { in: selectedEntries.map((entry) => entry.id) } },
      data: {
        invoiceId: invoice.id,
        payPeriodId: payPeriod.id,
      },
    });

    revalidatePath(`/work/${clientId}/${projectId}/invoices`);
    revalidatePath(`/work/${clientId}/${projectId}/work-log`);
    return { message: `Created invoice ${invoice.invoiceNo}.` };
  }

  return (
    <InvoicesTable
      rows={tableRows}
      onUpdateInvoice={updateInvoiceAction}
      onCreateInvoice={createInvoiceFromEntriesAction}
    />
  );
}
