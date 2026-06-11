import { SparkleIcon } from "@phosphor-icons/react";
import { ApiVolunteerGetList } from "need4deed-sdk";
import { Paragraph } from "@/components/styled/text";
import CardDetail from "./CardDetail";
import { getFirstName, truncateList } from "./helpers";
import { IconName } from "./icon";
import { Card, ProfileDiv, StatusTagsDiv, TagDiv } from "./styles";
import { useTranslation } from "react-i18next";

interface Props {
  volunteer: ApiVolunteerGetList;
}

export function VolunteerReadOnlyCard({ volunteer }: Props) {
  const { t } = useTranslation();

  const { name, locations, statusType } = volunteer;
  const MAX_CARD_ITEMS = 2;
  const locationTitles =
    truncateList(
      locations.map((loc) => loc.title),
      MAX_CARD_ITEMS,
    ) || "—";

  return (
    <Card $cursor="auto">
      <StatusTagsDiv>
        <>
          {statusType && (
            <>
              <TagDiv>
                <Paragraph
                  fontWeight="var(--dashboard-volunteers-card-tag-fontWeight)"
                  fontSize="var(--dashboard-volunteers-card-status-fontSize)"
                  lineheight="var(--dashboard-volunteers-card-tag-lineHeight)"
                >
                  {statusType.toUpperCase()}
                </Paragraph>
                <SparkleIcon size={18} color="var(--color-midnight)" />
              </TagDiv>
            </>
          )}
        </>
      </StatusTagsDiv>

      <ProfileDiv>
        <Paragraph
          fontWeight="var(--dashboard-volunteers-card-profile-fontWeight)"
          fontSize="var(--dashboard-volunteers-card-profile-fontSize)"
          lineheight="var(--dashboard-volunteers-card-profile-lineHeight)"
        >
          {getFirstName(name)}
        </Paragraph>
      </ProfileDiv>

      <CardDetail header={t("dashboard.volunteers.preferredDistricts")} iconName={IconName.MapPin}>
        <Paragraph
          fontSize="var(--dashboard-volunteers-card-paragraph-fontSize)"
          lineheight="var(--dashboard-volunteers-card-paragraph-lineHeight)"
        >
          {locationTitles}
        </Paragraph>
      </CardDetail>
    </Card>
  );
}
