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
  isPrepared?: boolean;
  unclaimedEntries?: {
    id: string;
    workDate: string;
    hours: string;
    notes: string;
  }[];
};

type InvoicesTableProps = {
  rows: InvoiceRow[];
  onUpdateInvoice: (formData: FormData) => Promise<{ message: string }>;
  onCreateInvoice: (formData: FormData) => Promise<{ message: string }>;
};

export default function InvoicesTable({
  rows,
  onUpdateInvoice,
  onCreateInvoice,
}: InvoicesTableProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const createDialogRef = useRef<HTMLDialogElement | null>(null);
  const [active, setActive] = useState<InvoiceRow | null>(null);
  const [prepared, setPrepared] = useState<InvoiceRow | null>(null);
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
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

  function openCreate(row: InvoiceRow) {
    setPrepared(row);
    setSelectedEntryIds([]);
    createDialogRef.current?.showModal();
  }

  function closeEditor() {
    dialogRef.current?.close();
  }

  function closeCreate() {
    createDialogRef.current?.close();
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

  function toggleEntry(id: string, checked: boolean) {
    setSelectedEntryIds((prev) => {
      if (checked) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      }
      return prev.filter((value) => value !== id);
    });
  }

  function submitCreate() {
    if (!prepared) return;
    startTransition(async () => {
      try {
        const formData = new FormData();
        for (const id of selectedEntryIds) {
          formData.append("entryIds", id);
        }
        const result = await onCreateInvoice(formData);
        setToast({ visible: true, message: result.message, tone: "success" });
        closeCreate();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create invoice.";
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
                  <td className={`border-b px-3 py-2 ${row.isPrepared ? "font-semibold" : ""}`}>
                    {row.periodStart} - {row.periodEnd}
                  </td>
                  <td className="border-b px-3 py-2">
                    {row.isPrepared ? (
                      `${row.invoiceNo} (prepared)`
                    ) : row.invoiceId && row.invoiceNo ? (
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
                    {row.isPrepared ? (
                      <button
                        type="button"
                        className="border bg-black px-2 py-1 text-xs text-white hover:opacity-90"
                        onClick={() => openCreate(row)}
                      >
                        Create Invoice
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="border px-2 py-1 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        onClick={() => openEditor(row)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnchoredDialog ref={createDialogRef} width="xl">
        {prepared ? (
          <div className="flex flex-col gap-4 p-5">
            <div className="text-base font-semibold">
              Create Invoice {prepared.invoiceNo}
            </div>
            <p className="text-sm text-neutral-700">
              Select the unclaimed work-log entries to include in this invoice.
            </p>

            <div className="max-h-[65vh] overflow-auto border">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-left">
                    <th className="border-b px-3 py-2 font-medium w-[48px]">
                      <input
                        type="checkbox"
                        checked={
                          (prepared.unclaimedEntries?.length ?? 0) > 0 &&
                          selectedEntryIds.length ===
                            (prepared.unclaimedEntries?.length ?? 0)
                        }
                        onChange={(event) =>
                          setSelectedEntryIds(
                            event.target.checked
                              ? prepared.unclaimedEntries?.map((entry) => entry.id) ?? []
                              : [],
                          )
                        }
                      />
                    </th>
                    <th className="border-b px-3 py-2 font-medium">Date</th>
                    <th className="border-b px-3 py-2 font-medium">Hours</th>
                    <th className="border-b px-3 py-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {prepared.unclaimedEntries?.map((entry) => (
                    <tr key={entry.id} className="align-top">
                      <td className="border-b px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedEntryIds.includes(entry.id)}
                          onChange={(event) =>
                            toggleEntry(entry.id, event.target.checked)
                          }
                        />
                      </td>
                      <td className="border-b px-3 py-2">{entry.workDate}</td>
                      <td className="border-b px-3 py-2">{entry.hours}</td>
                      <td className="border-b px-3 py-2">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="border px-3 py-2 text-sm"
                onClick={closeCreate}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dark:bg-white dark:text-black bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
                onClick={submitCreate}
                disabled={isPending || selectedEntryIds.length === 0}
              >
                {isPending ? "Creating..." : "Create Invoice"}
              </button>
            </div>
          </div>
        ) : null}
      </AnchoredDialog>

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
