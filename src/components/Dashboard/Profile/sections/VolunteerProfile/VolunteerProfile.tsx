"use client";
import Button from "@/components/core/button/Button/Button";
import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApiVolunteerGet,
  Lang,
  VolunteerStateCommunicationType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import { isBriefedAccompanying } from "../ProfileHeader/common";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { formToApiAvailability } from "./availabilityUtils";
import { DisplayFields } from "./DisplayFields";
import {
  extractTitles,
  formatAvailability,
  formatLanguagesForDisplay,
  formatLocationsForDisplay,
  getVolunteerTypeLabel,
} from "./formatters";
import { FormFields } from "./FormFields";
import { useApiActivities, useApiDistricts, useApiLanguages, useApiSkills } from "./hooks";
import { createMapping } from "./mappingUtils";
import { ButtonRow, Container, Details } from "./styles";
import {
  createFormDefaultValues,
  createLabelToVolunteerTypeMap,
  mapToApiItems,
  transformLanguagesToApi,
} from "./transformers";
import { createVolunteerProfileSchema, VolunteerProfileFormData } from "./volunteerProfileSchema";

type Props = {
  volunteer: ApiVolunteerGet;
} & EditableSectionProps;

export type VolunteerProfileRef = EditableSectionRef;

export const VolunteerProfile = forwardRef<VolunteerProfileRef, Props>(function VolunteerProfile(
  { volunteer, onEditingChange },
  ref,
) {
  const { t, i18n } = useTranslation();
  const { mutate: updateProfile, isPending } = useUpdateVolunteerProfile(volunteer.id);
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();
  const { data: apiDistricts = [] } = useApiDistricts();

  const languageMapping = useMemo(() => createMapping(apiLanguages), [apiLanguages]);
  const activityMapping = useMemo(() => createMapping(apiActivities), [apiActivities]);
  const skillMapping = useMemo(() => createMapping(apiSkills), [apiSkills]);
  const districtMapping = useMemo(() => createMapping(apiDistricts), [apiDistricts]);

  const languagesForForm = useMemo(
    () =>
      apiLanguages.map((lang) => ({
        id: lang.id,
        title: { [i18n.language as Lang]: lang.title } as Record<Lang, string>,
      })),
    [apiLanguages, i18n.language],
  );

  const schema = useMemo(() => createVolunteerProfileSchema(t), [t]);

  const { control, handleSubmit, reset, trigger, formState } = useForm<VolunteerProfileFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: createFormDefaultValues(
      volunteer,
      languageMapping,
      districtMapping,
      activityMapping,
      skillMapping,
      t,
    ),
  });

  const { errors, isValid, isDirty } = formState;

  useEffect(() => {
    if (!apiLanguages.length || !apiActivities.length || !apiSkills.length || !apiDistricts.length) return;

    reset(createFormDefaultValues(volunteer, languageMapping, districtMapping, activityMapping, skillMapping, t));
    trigger();
    setIsEditing(false);
  }, [
    volunteer,
    reset,
    trigger,
    t,
    languageMapping,
    activityMapping,
    skillMapping,
    districtMapping,
    apiLanguages.length,
    apiActivities.length,
    apiSkills.length,
    apiDistricts.length,
  ]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useImperativeHandle(ref, () => ({
    handleEditClick,
  }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: VolunteerProfileFormData) => {
    const statusType = createLabelToVolunteerTypeMap(t)[data.volunteerType];

    updateProfile(
      {
        availability: formToApiAvailability(data.availability),
        ...(statusType && Object.values(VolunteerStateTypeType).includes(statusType) && { statusType }),
        languages: transformLanguagesToApi(data.languages, languageMapping),
        locations: mapToApiItems(data.districts, districtMapping),
        activities: mapToApiItems(data.activities, activityMapping),
        skills: mapToApiItems(data.skills, skillMapping),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <Container data-testid="volunteer-profile-container" $isEditing={isEditing}>
      <Details>
        {isEditing ? (
          <FormFields
            control={control}
            errors={errors}
            t={t}
            i18n={i18n}
            districts={apiDistricts}
            districtMapping={districtMapping}
            activities={apiActivities}
            activityMapping={activityMapping}
            skills={apiSkills}
            skillMapping={skillMapping}
            languagesForForm={languagesForForm}
            trigger={trigger}
          />
        ) : (
          <DisplayFields
            languages={formatLanguagesForDisplay(
              volunteer.languages,
              languageMapping.idToTitle,
              t,
            )}
            availability={formatAvailability(volunteer.availability, t)}
            districts={formatLocationsForDisplay(volunteer.locations)}
            volunteerType={getVolunteerTypeLabel(volunteer.statusType, t)}
            volunteerTypeStatus={volunteer.statusType}
            showBriefedCheck={isBriefedAccompanying(
              volunteer.statusType,
              volunteer.statusCommunication as VolunteerStateCommunicationType,
            )}
            activities={extractTitles(volunteer.activities)}
            skills={extractTitles(volunteer.skills)}
            comments={volunteer.infoAbout}
            t={t}
          />
        )}
      </Details>

      {isEditing && (
        <ButtonRow>
          <Button
            text={t("dashboard.volunteerProfile.profileSection.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.volunteerProfile.profileSection.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={!isDirty || !isValid || isPending}
          />
        </ButtonRow>
      )}
    </Container>
  );
});
