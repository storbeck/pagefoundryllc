import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_RATE = 100;

function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function monthLabel(start: Date, end: Date): string {
  const startMonth = start.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const endMonth = end.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  if (startMonth === endMonth) return `${startMonth} ${startDay}-${endDay}`;
  return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "";
  return value.toLocaleDateString("en-US", { timeZone: "UTC" });
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function PayPeriodPage({
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
          invoiceNo: true,
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

  const today = utcDay(new Date());
  const visiblePayPeriods = payPeriods.filter(
    (period) => utcDay(period.startDate).getTime() <= today.getTime(),
  );

  if (visiblePayPeriods.length === 0) {
    return <div className="text-sm text-neutral-600">No pay periods yet.</div>;
  }

  function color(hoursWorked: number): string {
    if (hoursWorked >= 80) {
      return 'text-green-700'
    } else if (hoursWorked >= 70) {
      return 'text-orange-700'
    } else if (hoursWorked >= 50) {
      return 'text-red-700'
    } else {
      return 'text-black'
    }
  }

  const rows = visiblePayPeriods.map((period) => {
      const key = `${utcDay(period.startDate).toISOString()}|${utcDay(period.endDate).toISOString()}`;
      const rate =
        period.hourlyRate != null
          ? Number(period.hourlyRate)
          : period.invoice?.hourlyRate != null
            ? Number(period.invoice.hourlyRate)
            : project.hourlyRate != null
              ? Number(project.hourlyRate)
              : DEFAULT_RATE;
      const hours =
        period.totalHours != null
          ? Number(period.totalHours)
          : period.invoice?.totalHours != null
            ? Number(period.invoice.totalHours)
            : 0;
      const amount =
        period.invoice?.totalAmount != null
          ? Number(period.invoice.totalAmount)
          : hours * rate;
      const notePreview = period.invoice?.notes || "";

      return {
        key,
        label: monthLabel(period.startDate, period.endDate),
        start: period.startDate,
        end: period.endDate,
        hours,
        rate,
        amount,
        invoiceNo: period.invoice?.invoiceNo ?? "",
        sentAt: period.invoice?.sentAt ?? null,
        paidAt: period.invoice?.paidAt ?? null,
        notes: notePreview,
      };
    });

  const [current, ...history] = rows;

  return (
    <div className="space-y-5">
      {history.length > 0 ? (
        <section className="space-y-3">
          <div className="overflow-x-auto border">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-900 text-left">
                  <th className="border-b px-3 py-2 font-medium">Period</th>
                  <th className="border-b px-3 py-2 font-medium w-[80px]">Invoice</th>
                  <th className="border-b px-3 py-2 font-medium">Hours</th>
                  <th className="border-b px-3 py-2 font-medium">Rate</th>
                  <th className="border-b px-3 py-2 font-medium">Sent</th>
                  <th className="border-b px-3 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.key} className="align-top">
                    <td className="border-b px-3 py-2">
                      {formatDate(row.start)} - {formatDate(row.end)}
                    </td>
                    <td className="border-b px-3 py-2">
                      {row.invoiceNo || "No invoice"}
                    </td>
                    <td className={`border-b px-3 py-2 font-bold ${color(row.hours)}`}>
                      {row.hours.toFixed(2)}
                    </td>
                    <td className="border-b px-3 py-2">{formatMoney(row.rate)}</td>
                    <td className="border-b px-3 py-2">
                      {formatDate(row.sentAt) || "-"}
                    </td>
                    <td className="border-b px-3 py-2">{row.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
