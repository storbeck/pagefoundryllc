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

  const payPeriods = await prisma.payPeriod.findMany({
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
  });

  

  const entries = await prisma.dailyLogEntry.findMany({
    where: {
      projectId,
    },
    select: {
      workDate: true,
      hours: true,
    },
  })

  const rows: InvoiceRow[] = payPeriods.map((period) => {
    const rate =
      project.hourlyRate != null ? Number(project.hourlyRate) : DEFAULT_RATE;
    // Source of truth: sum hours from work-log entries that fall inside this pay period.
    const hours = entries.reduce((sum, entry) => {
      if (!isInRange(entry.workDate, period.startDate, period.endDate))
        return sum;
      return sum + Number(entry.hours);
    }, 0);
    const amount = hours * rate;

    return {
      payPeriodId: period.id,
      invoiceId: period.invoice?.id ?? "",
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
    };
  });

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

  return <InvoicesTable rows={rows} onUpdateInvoice={updateInvoiceAction} />;
}
