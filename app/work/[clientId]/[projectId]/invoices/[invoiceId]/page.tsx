import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DownloadPdfButton from "./download-pdf-button";

const DEFAULT_RATE = 100;

function utcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  const ts = utcDay(date).getTime();
  return ts >= utcDay(start).getTime() && ts <= utcDay(end).getTime();
}

function formatLongDate(value: Date): string {
  return value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatShortRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const endMonth = end.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  if (startMonth === endMonth) return `${startMonth} ${startDay} - ${endDay}`;
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ clientId: string; projectId: string; invoiceId: string }>;
}) {
  const user = await requireUser();
  const { clientId, projectId, invoiceId } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      projectId,
      clientId,
      project: { ownerId: user.id },
    },
    include: {
      client: {
        select: {
          name: true,
          contactName: true,
          contactEmail: true,
          addressLine1: true,
          addressLine2: true,
        },
      },
      project: {
        select: {
          name: true,
          description: true,
          hourlyRate: true,
        },
      },
      payPeriod: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  if (!invoice) return <div className="p-6">Invoice not found.</div>;

  const linkedEntries = await prisma.dailyLogEntry.findMany({
    where: { projectId, invoiceId: invoice.id },
    select: { workDate: true, hours: true },
  });

  const hours = linkedEntries.length
    ? linkedEntries.reduce((sum, entry) => sum + Number(entry.hours), 0)
    : (
        await prisma.dailyLogEntry.findMany({
          where: { projectId },
          select: { workDate: true, hours: true },
        })
      ).reduce((sum, entry) => {
        if (
          !isInRange(entry.workDate, invoice.payPeriod.startDate, invoice.payPeriod.endDate)
        ) {
          return sum;
        }
        return sum + Number(entry.hours);
      }, 0);

  const rate =
    invoice.project.hourlyRate != null
      ? Number(invoice.project.hourlyRate)
      : Number(invoice.hourlyRate || DEFAULT_RATE);
  const amount = hours * rate;
  const issuedDate = invoice.issuedAt || invoice.sentAt || invoice.payPeriod.endDate;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-8">
      <div className="mb-3 flex justify-end">
        <DownloadPdfButton />
      </div>

      <article id="invoice-print-root" className="rounded-sm border border-neutral-300 bg-white p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <Image src="/logo.png" alt="PageFoundry LLC" width={68} height={68} />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PAGEFOUNDRY LLC - INVOICE</h1>
            <p className="mt-1 text-lg">Geoff Storbeck - geoff@pagefoundry.dev</p>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="mb-2 text-4xl font-bold">Bill To</h2>
          <div className="grid border sm:grid-cols-2">
            <div className="space-y-1 border-b p-3 text-lg sm:border-b-0 sm:border-r">
              <p className="font-bold">{invoice.client.name}</p>
              <p>{invoice.client.contactName || "-"}</p>
              <p>{invoice.client.contactEmail || "-"}</p>
              <p className="pt-2">{invoice.client.addressLine1 || "-"}</p>
              <p>{invoice.client.addressLine2 || ""}</p>
            </div>
            <div className="space-y-1 p-3 text-lg">
              <p>
                <span className="font-bold">Invoice #:</span> {invoice.invoiceNo}
              </p>
              <p>
                <span className="font-bold">Date Issued:</span> {formatLongDate(issuedDate)}
              </p>
              <p>
                <span className="font-bold">Billing Period:</span>{" "}
                {formatShortRange(invoice.payPeriod.startDate, invoice.payPeriod.endDate)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-4xl font-bold">Work Description</h2>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 gap-y-2 text-lg">
            <p className="font-bold">Description</p>
            <p className="font-bold">Hours</p>
            <p className="font-bold">Rate</p>
            <p className="font-bold">Amount</p>

            <p>
              {invoice.project.description ||
                `Frontend engineering (${formatShortRange(invoice.payPeriod.startDate, invoice.payPeriod.endDate)})`}
            </p>
            <p className="font-bold">{hours.toFixed(2)}</p>
            <p>${rate.toFixed(2)}/hr</p>
            <p className="font-bold">{formatMoney(amount)}</p>
          </div>

          <p className="mt-6 text-2xl font-bold">Total Due: {formatMoney(amount)}</p>
          <p className="mt-4 text-lg">
            <span className="font-bold">Payment Terms:</span> Due upon receipt
          </p>
          <p className="text-lg">
            <span className="font-bold">Invoice Frequency:</span> Bi-Monthly (every 10 working days)
          </p>
        </section>

        <section className="mt-8 text-lg">
          <h2 className="font-bold">Notes</h2>
          <p>{invoice.notes || "Thank you for your business."}</p>
        </section>
      </article>

      <style>{`
        @media print {
          @page {
            margin: 10mm;
          }

          body * {
            visibility: hidden;
          }

          #invoice-print-root,
          #invoice-print-root * {
            visibility: visible;
          }

          #invoice-print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            border: 0;
            border-radius: 0;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
