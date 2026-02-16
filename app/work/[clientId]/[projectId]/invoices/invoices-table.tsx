"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import AnchoredDialog from "@/components/anchored-dialog";
import FloatingMessage from "@/components/floating-message";

export type InvoiceRow = {
  payPeriodId: string;
  invoiceId: string;
  detailHref: string;
  periodStart: string;
  periodEnd: string;
  invoiceNo: string;
  status: "DRAFT" | "VOID" | "SENT" | "PAID";
  hours: string;
  rate: string;
  amount: string;
  sentAt: string;
  paidAt: string;
  notes: string;
};

type InvoicesTableProps = {
  rows: InvoiceRow[];
  onUpdateInvoice: (formData: FormData) => Promise<{ message: string }>;
};

export default function InvoicesTable({
  rows,
  onUpdateInvoice,
}: InvoicesTableProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [active, setActive] = useState<InvoiceRow | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    tone: "success" | "error";
  }>({
    visible: false,
    message: "",
    tone: "success",
  });
  const [isPending, startTransition] = useTransition();

  const hasRows = useMemo(() => rows.length > 0, [rows.length]);

  function openEditor(row: InvoiceRow) {
    setActive(row);
    dialogRef.current?.showModal();
  }

  function closeEditor() {
    dialogRef.current?.close();
  }

  function closeToast() {
    setToast((prev) => ({ ...prev, visible: false }));
  }

  function submitEdit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await onUpdateInvoice(formData);
        setToast({ visible: true, message: result.message, tone: "success" });
        closeEditor();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update invoice.";
        setToast({ visible: true, message, tone: "error" });
      }
    });
  }

  return (
    <section className="space-y-4">
      <FloatingMessage
        message={toast.message}
        visible={toast.visible}
        tone={toast.tone}
        onClose={closeToast}
      />

      <div className="overflow-x-auto border">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900 text-left">
              <th className="border-b px-3 py-2 font-medium">Period</th>
              <th className="border-b px-3 py-2 font-medium">Invoice #</th>
              <th className="border-b px-3 py-2 font-medium">Hours</th>
              <th className="border-b px-3 py-2 font-medium">Amount</th>
              <th className="border-b px-3 py-2 font-medium">Sent</th>
              <th className="border-b px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {!hasRows ? (
              <tr>
                <td className="px-3 py-6 text-center text-neutral-600" colSpan={10}>
                  No invoice rows yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.payPeriodId} className="align-top">
                  <td className="border-b px-3 py-2">
                    {row.periodStart} - {row.periodEnd}
                  </td>
                  <td className="border-b px-3 py-2">
                    {row.invoiceId && row.invoiceNo ? (
                      <Link
                        className="underline hover:no-underline"
                        href={row.detailHref}
                      >
                        {row.invoiceNo}
                      </Link>
                    ) : (
                      row.invoiceNo || "-"
                    )}
                  </td>
                  <td className="border-b px-3 py-2">{row.hours}</td>
                  <td className="border-b px-3 py-2">{row.amount}</td>
                  <td className="border-b px-3 py-2">{row.sentAt || "-"}</td>
                  <td className="border-b px-3 py-2">
                    <button
                      type="button"
                      className="border px-2 py-1 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      onClick={() => openEditor(row)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnchoredDialog ref={dialogRef} width="lg">
        {active ? (
          <form action={submitEdit} className="flex flex-col gap-4 p-5">
            <div className="text-base font-semibold">
              Edit Invoice {active.invoiceNo || ""}
            </div>

            <input type="hidden" name="payPeriodId" value={active.payPeriodId} />
            <input type="hidden" name="invoiceId" value={active.invoiceId} />

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Period start</span>
                <input
                  type="date"
                  name="periodStart"
                  defaultValue={active.periodStart}
                  className="border px-3 py-2"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Period end</span>
                <input
                  type="date"
                  name="periodEnd"
                  defaultValue={active.periodEnd}
                  className="border px-3 py-2"
                  required
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Status</span>
                <select
                  name="status"
                  defaultValue={active.status}
                  className="border px-3 py-2"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="VOID">VOID</option>
                  <option value="SENT">SENT</option>
                  <option value="PAID">PAID</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Sent date</span>
                <input
                  type="date"
                  name="sentAt"
                  defaultValue={active.sentAt}
                  className="border px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Paid date</span>
                <input
                  type="date"
                  name="paidAt"
                  defaultValue={active.paidAt}
                  className="border px-3 py-2"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Notes</span>
              <textarea
                name="notes"
                defaultValue={active.notes}
                className="min-h-24 border px-3 py-2"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="border px-3 py-2 text-sm"
                onClick={closeEditor}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="dark:bg-white dark:text-black bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Invoice"}
              </button>
            </div>
          </form>
        ) : null}
      </AnchoredDialog>
    </section>
  );
}
