import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { getMainCommunicationLanguageOptions } from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
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
}: {
  isEvent: boolean;
  apiLanguages: ApiLanguageOption[];
  apiActivities: ApiLanguageOption[];
  apiSkills: ApiLanguageOption[];
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";
  const toFormOption = (l: ApiLanguageOption) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  });
  const languagesForForm = apiLanguages.map(toFormOption);
  // Main communication is German and/or English only (fe#1039), matching the
  // schema's validation and the edit form; residents may speak any language.
  const mainCommunicationLanguagesForForm = getMainCommunicationLanguageOptions(apiLanguages).map(toFormOption);

  return (
    <FormDetails>
      <DescriptionField prefix={prefix} />
      <MainCommunicationField prefix={prefix} languagesForForm={mainCommunicationLanguagesForForm} />
      <ResidentsSpeakField prefix={prefix} languagesForForm={languagesForForm} />
      {isEvent ? <EventDateTimeFields prefix={prefix} /> : <AvailabilityField prefix={prefix} />}
      <NumberOfVolunteersField prefix={prefix} />
      <ActivitiesField prefix={prefix} apiActivities={apiActivities} />
      <SkillsField prefix={prefix} apiSkills={apiSkills} />
    </FormDetails>
  );
}
