import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { FormDetails } from "@/components/Dashboard/Profile/sections/shared/styles";
import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import DescriptionField from "./DescriptionField";
import MainCommunicationField from "./MainCommunicationField";
import ResidentsSpeakField from "./ResidentsSpeakField";
import EventDateTimeFields from "./EventDateTimeFields";
import AvailabilityField from "./AvailabilityField";
import NumberOfVolunteersField from "./NumberOfVolunteersField";
import ActivitiesField from "./ActivitiesField";
import SkillsField from "./SkillsField";

export function OpportunityDetailsFields({
  isEvent,
  apiLanguages,
  apiActivities,
  apiSkills,
  isAccompanying,
}: {
  isEvent: boolean;
  apiLanguages: ApiLanguageOption[];
  apiActivities: ApiLanguageOption[];
  apiSkills: ApiLanguageOption[];
  isAccompanying: boolean;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";
  const languagesForForm = apiLanguages.map((l) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  }));

  return (
    <FormDetails>
      <DescriptionField prefix={prefix} />
      {!isAccompanying ? (
        <>
          <MainCommunicationField prefix={prefix} languagesForForm={languagesForForm} />
          <ResidentsSpeakField prefix={prefix} languagesForForm={languagesForForm} />
          {isEvent ? <EventDateTimeFields prefix={prefix} /> : <AvailabilityField prefix={prefix} />}
          <NumberOfVolunteersField prefix={prefix} />
          <ActivitiesField prefix={prefix} apiActivities={apiActivities} />
          <SkillsField prefix={prefix} apiSkills={apiSkills} />
        </>
      ) : null}
    </FormDetails>
  );
}
