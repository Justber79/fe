import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { FieldGroup } from "../styled";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { useTranslation } from "react-i18next";
import { apiToFormAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/availabilityUtils";
import { ErrorMessage } from "@/components/core/common";
import { Lang } from "need4deed-sdk";

export default function AvailabilityField({ prefix }: { prefix: string }) {
  const { control } = useFormContext<OpportunityDetailsFormData>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Controller
      name="availability"
      control={control}
      render={({ field, fieldState }) => (
        <FieldGroup>
          <label>{t(`${prefix}.schedule`)}</label>
          <div>
            <AvailabilityGrid
              availability={field.value ?? apiToFormAvailability(undefined)}
              onChange={field.onChange}
              t={t}
              currentLanguage={lang as Lang}
            />
            {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
          </div>
        </FieldGroup>
      )}
    />
  );
}
