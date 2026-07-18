import { EditableField } from "@/components/EditableField/EditableField";
import {
  Card,
  IconContainer,
  ProfileContent,
  ProfileInfo,
  StatusSection,
  TitleSection,
} from "@/components/Dashboard/Profile/sections/ProfileHeader/common/profileHeaderStyles";
import { ShootingStarIcon } from "@phosphor-icons/react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VolunteerStateTypeType } from "need4deed-sdk";
import { VolunteerTypeRow, TypeButtons, TypeButton } from "./styled";
import { Heading4 } from "@/components/styled/text";
import { createVolunteerTypeLabelMap } from "@/components/Dashboard/Profile/sections/ProfileHeader/common/labelMaps";
import { HeaderFormData } from "./headerSchema";

const SELECTABLE_VOLUNTEER_TYPES = [
  VolunteerStateTypeType.REGULAR,
  VolunteerStateTypeType.ACCOMPANYING,
  VolunteerStateTypeType.EVENTS,
] as const;

export default function OpportunityHeaderCard({ selectedType }: { selectedType: VolunteerStateTypeType }) {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<HeaderFormData>();
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  return (
    <Card>
      <ProfileContent>
        <IconContainer>
          <ShootingStarIcon size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
        <ProfileInfo>
          <TitleSection>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <EditableField
                  mode="edit"
                  type="text"
                  label={t("dashboard.newOpportunity.fields.title")}
                  value={field.value}
                  setValue={field.onChange}
                  errorMessage={errors.title?.message}
                />
              )}
            />
          </TitleSection>

          <StatusSection>
            <VolunteerTypeRow>
              <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Heading4>
              <TypeButtons>
                {SELECTABLE_VOLUNTEER_TYPES.map((type) => (
                  <TypeButton
                    key={type}
                    type="button"
                    $active={selectedType === type}
                    onClick={() => setValue("volunteerType", type, { shouldValidate: true })}
                  >
                    {volunteerTypeLabelMap[type]}
                  </TypeButton>
                ))}
              </TypeButtons>
            </VolunteerTypeRow>
          </StatusSection>
        </ProfileInfo>
      </ProfileContent>
    </Card>
  );
}
