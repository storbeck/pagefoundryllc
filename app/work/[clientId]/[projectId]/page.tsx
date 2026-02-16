import { redirect } from "next/navigation";

export default async function ProjectHome({
  params,
}: {
  params: Promise<{ clientId: string; projectId: string }>;
}) {
  const { clientId, projectId } = await params;
  redirect(`/work/${clientId}/${projectId}/work-log`);
}
