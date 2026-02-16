"use client";

import { useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Clients({
  clients,
  projectsByClient,
  createClientAction,
}: {
  clients: { id: string; name: string }[];
  projectsByClient: Record<string, { id: string; name: string }[]>;
  createClientAction: (formData: FormData) => void | Promise<void>;
}) {
  const router = useRouter();
  const params = useParams<{ clientId?: string; projectId?: string }>();
  const clientId = typeof params.clientId === "string" ? params.clientId : "";
  const projectId =
    typeof params.projectId === "string" ? params.projectId : "";
  const projects = clientId ? projectsByClient[clientId] ?? [] : [];
  const selectedProjectId = projectId || projects[0]?.id || "";
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  function onClientChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    if (!value) {
      router.replace("/work");
      return;
    }

    const firstProject = projectsByClient[value]?.[0];
    if (firstProject) {
      router.replace(`/work/${value}/${firstProject.id}`);
      return;
    }

    router.replace(`/work/${value}`);
  }

  function onProjectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (!clientId || !value) return;
    router.replace(`/work/${clientId}/${value}`);
  }

  return (
    <div className="flex w-full flex-wrap items-end gap-4">
      <label className="flex min-w-56 flex-1 flex-col gap-1">
        <span className="text-sm">Client</span>
        <select
          value={clientId}
          onChange={onClientChange}
          className="border px-3 py-2"
        >
          <option value="">Select client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-56 flex-1 flex-col gap-1">
        <span className="text-sm">Project</span>
        <select
          value={selectedProjectId}
          onChange={onProjectChange}
          className="border px-3 py-2"
          disabled={!clientId || projects.length === 0}
        >
          <option value="">
            {!clientId ? "Select client first…" : "Select project…"}
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="bg-black p-3 text-sm text-white dark:invert"
        onClick={() => dialogRef.current?.showModal()}
      >
        New Client
      </button>

      <dialog ref={dialogRef} className="w-full max-w-md rounded-lg p-0">
        <form action={createClientAction} className="flex flex-col gap-4 p-5">
          <div className="text-base font-semibold">Create Client</div>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Client name</span>
            <input
              name="name"
              className="border px-3 py-2"
              placeholder="Acme Co"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Project name (optional)</span>
            <input
              name="projectName"
              className="border px-3 py-2"
              placeholder="Default Project"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="border px-3 py-2 text-sm"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button className="bg-black px-3 py-2 text-sm text-white">
              Create
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
