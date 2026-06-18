import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { getServerAgent } from "@/hooks/api/getAgent";
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
  const agent = await getServerAgent(cookieHeader, id);

  if (user?.role === UserRole.AGENT && user?.personId !== agent?.representative?.id) {
    redirect(`/dashboard/agents`);
  }
  return <ProfileLayout entityId={id} entityType="agent" />;
}
