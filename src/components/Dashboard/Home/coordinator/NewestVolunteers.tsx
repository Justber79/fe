import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiVolunteerGetList, SortOrder, VolunteerStateEngagementType } from "need4deed-sdk";
import VolunteerCard from "../../Volunteers/VolunteerCard";
import { Heading4 } from "@/components/styled/text";
import { useTranslation } from "react-i18next";

export function NewestVolunteers() {
  const { t } = useTranslation();
  const { data: volunteers, isLoading } = useGetQuery<ApiVolunteerGetList[]>({
    queryKey: ["volunteers", "newest"],
    apiPath: `${apiPathVolunteer}/`,
    params: {
      limit: 2,
      page: 1,
      sortOrder: SortOrder.NewToOld,
      filter: { status: VolunteerStateEngagementType.NEW },
    },
    staleTime: cacheTTL,
  });

  if (isLoading) {
    return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  }

  return volunteers?.map((vol) => <VolunteerCard key={vol.id} volunteer={vol} />);
}
