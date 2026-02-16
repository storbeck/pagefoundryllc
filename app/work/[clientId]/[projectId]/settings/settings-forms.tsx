"use client";

import { useState, useTransition } from "react";
import FloatingMessage from "@/components/floating-message";

type SettingsFormsProps = {
  client: {
    contactName: string;
    contactEmail: string;
    addressLine1: string;
    addressLine2: string;
  };
  project: {
    description: string;
    hourlyRate: string;
    repositoryUrl: string;
  };
  onSaveClient: (formData: FormData) => Promise<{ message: string }>;
  onSaveProject: (formData: FormData) => Promise<{ message: string }>;
};

export default function SettingsForms({
  client,
  project,
  onSaveClient,
  onSaveProject,
}: SettingsFormsProps) {
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

  function showSuccess(message: string) {
    setToast({ visible: true, message, tone: "success" });
  }

  function showError(message: string) {
    setToast({ visible: true, message, tone: "error" });
  }

  function closeToast() {
    setToast((prev) => ({ ...prev, visible: false }));
  }

  function saveClient(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await onSaveClient(formData);
        showSuccess(result.message);
      } catch (error) {
        showError(error instanceof Error ? error.message : "Failed to save client settings.");
      }
    });
  }

  function saveProject(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await onSaveProject(formData);
        showSuccess(result.message);
      } catch (error) {
        showError(error instanceof Error ? error.message : "Failed to save project settings.");
      }
    });
  }

  return (
    <>
      <FloatingMessage
        message={toast.message}
        visible={toast.visible}
        tone={toast.tone}
        onClose={closeToast}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <section className="p-4">
          <h2 className="mb-4 text-base font-semibold">Client Settings</h2>
          <form action={saveClient} className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm">Contact name</span>
              <input
                name="contactName"
                defaultValue={client.contactName}
                className="border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Contact email</span>
              <input
                type="email"
                name="contactEmail"
                defaultValue={client.contactEmail}
                className="border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Address line 1</span>
              <input
                name="addressLine1"
                defaultValue={client.addressLine1}
                className="border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Address line 2</span>
              <input
                name="addressLine2"
                defaultValue={client.addressLine2}
                className="border px-3 py-2"
              />
            </label>

            <button
              className="dark:bg-white dark:text-black bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Client"}
            </button>
          </form>
        </section>

        <section className="p-4">
          <h2 className="mb-4 text-base font-semibold">Project Settings</h2>
          <form action={saveProject} className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm">Description</span>
              <textarea
                name="description"
                defaultValue={project.description}
                className="min-h-28 border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Hourly rate</span>
              <input
                name="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                defaultValue={project.hourlyRate}
                className="border px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Repository URL (optional)</span>
              <input
                name="repositoryUrl"
                type="url"
                defaultValue={project.repositoryUrl}
                className="border px-3 py-2"
              />
            </label>

            <button
              className="dark:bg-white dark:text-black bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Project"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
