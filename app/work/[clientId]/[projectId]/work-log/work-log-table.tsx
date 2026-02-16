"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AnchoredDialog from "@/components/anchored-dialog";

type WorkLogTableProps = {
  rows: {
    id: string;
    workDate: string;
    hours: string;
    notes: string;
    updatedAt: string;
    isPlaceholder: boolean;
  }[];
  onSaveEntry: (formData: FormData) => Promise<{ saved: boolean }>;
};

export default function WorkLogTable({
  rows,
  onSaveEntry,
}: WorkLogTableProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [activeRow, setActiveRow] = useState<WorkLogTableProps["rows"][number] | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function openEditor(row: WorkLogTableProps["rows"][number]) {
    setActiveRow(row);
    dialogRef.current?.showModal();
  }

  function saveRow(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      try {
        await onSaveEntry(formData);
        formRef.current?.reset();
        dialogRef.current?.close();
        setMessage("Row saved.");
        router.refresh();
      } catch (error) {
        const text =
          error instanceof Error
            ? error.message : "Failed to save row.";
        setMessage(text);
      }
    });
  }

  return (
    <section className="space-y-4">
      <div className="overflow-x-auto border">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900 text-left">
              <th className="border-b px-3 py-2 font-medium w-[120px]">Date</th>
              <th className="border-b px-3 py-2 font-medium">Hours</th>
              <th className="border-b px-3 py-2 font-medium">Notes</th>
              <th className="border-b px-3 py-2 font-medium w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-neutral-600">
                  No entries yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="border-b px-3 py-2">{row.workDate}</td>
                  <td className="border-b px-3 py-2">{row.hours}</td>
                  <td className="border-b px-3 py-2">{row.notes}</td>
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

      {message ? <p className="text-sm text-neutral-700">{message}</p> : null}

      <AnchoredDialog ref={dialogRef} width="lg">
        <form ref={formRef} action={saveRow} className="flex flex-col gap-4 p-5">
          <div className="text-base font-semibold">
            {activeRow?.isPlaceholder ? "Add Work Entry" : "Edit Work Entry"}
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Date</span>
            <input
              name="workDate"
              type="date"
              className="border px-3 py-2"
              defaultValue={activeRow?.workDate ?? ""}
              required
              readOnly
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Hours</span>
            <input
              name="hours"
              type="number"
              min="0"
              step="0.25"
              className="border px-3 py-2"
              defaultValue={activeRow?.hours ?? ""}
              placeholder="8"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Notes</span>
            <textarea
              name="notes"
              className="min-h-24 border px-3 py-2"
              placeholder="What you worked on..."
              defaultValue={activeRow?.notes ?? ""}
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="border px-3 py-2 text-sm"
              onClick={() => dialogRef.current?.close()}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              className="dark:bg-white dark:text-black bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Row"}
            </button>
          </div>
        </form>
      </AnchoredDialog>
    </section>
  );
}
