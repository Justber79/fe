import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { getServerUser } from "@/hooks/api/getUser";
import { RouteParams } from "@/types";
import { UserRole } from "need4deed-sdk";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardAgentPage({ params }: RouteParams) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await getServerUser(cookieHeader);

  if (user?.role === UserRole.AGENT && String(user?.agentId) !== String(id)) {
    redirect(`/dashboard/agents`);
  }
  return <ProfileLayout entityId={id} entityType="agent" />;
}
