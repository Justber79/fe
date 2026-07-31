import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";

export default function SkillsField({ prefix, apiSkills }: { prefix: string; apiSkills: ApiLanguageOption[] }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();
  const { t } = useTranslation();
  const skillMapping = createMapping(apiSkills);

  return (
    <Controller
      name="skills"
      control={control}
      render={({ field }) => (
        <EditableField
          mode="edit"
          type="checkbox-list"
          label={t(`${prefix}.skills`)}
          value={field.value.map((id) => skillMapping.idToTitle[Number(id)] || String(id))}
          setValue={(value) => {
            const labels = Array.isArray(value) ? value : [value];
            field.onChange(labels.map((label) => String(skillMapping.titleToId[label])));
          }}
          options={apiSkills.map((s) => s.title)}
          errorMessage={errors.skills?.message}
        />
      )}
    />
  );
}
