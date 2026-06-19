import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { RouteParams } from "@/types";

export default async function DashboardAgentPage({ params }: RouteParams) {
  const { id } = await params;

  return <ProfileLayout entityId={id} entityType="agent" />;
}
