import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";

export default function ActivitiesField({
  prefix,
  apiActivities,
}: {
  prefix: string;
  apiActivities: ApiLanguageOption[];
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();
  const { t } = useTranslation();
  const activityMapping = createMapping(apiActivities);

  return (
    <Controller
      name="activities"
      control={control}
      render={({ field }) => (
        <EditableField
          mode="edit"
          type="checkbox-list"
          label={t(`${prefix}.activities`)}
          value={field.value.map((id) => activityMapping.idToTitle[Number(id)] || String(id))}
          setValue={(value) => {
            const labels = Array.isArray(value) ? value : [value];
            field.onChange(labels.map((label) => String(activityMapping.titleToId[label])));
          }}
          options={apiActivities.map((a) => a.title)}
          errorMessage={errors.activities?.message}
        />
      )}
    />
  );
}
