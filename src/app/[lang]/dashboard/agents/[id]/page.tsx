import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { getServerUserRole } from "@/hooks/api/getUserRole";
import { RouteParams } from "@/types";
import { UserRole } from "need4deed-sdk";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardAgentPage({ params }: RouteParams) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const userRole = await getServerUserRole(cookieHeader);

  if (!userRole || (userRole !== UserRole.COORDINATOR && userRole !== UserRole.ADMIN)) {
    redirect(`/dashboard/agents`);
  }
  return <ProfileLayout entityId={id} entityType="agent" />;
}
