import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { RouteParams } from "@/types";
import { getSanitisedVolunteerProfile } from "@/hooks/api/getSanitisedVolunteer";
import { cookies } from "next/headers";

export default async function DashboardVolunteerPage({ params }: RouteParams) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const volunteer = await getSanitisedVolunteerProfile(id, cookieHeader);

  return <ProfileLayout entityId={id} entityType="volunteer" secureData={volunteer} />;
}
