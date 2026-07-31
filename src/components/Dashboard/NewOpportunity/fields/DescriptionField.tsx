import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { EditableField } from "@/components/EditableField/EditableField";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { useTranslation } from "react-i18next";

export default function DescriptionField({ prefix }: { prefix: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();
  const { t } = useTranslation();

  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <EditableField
          mode="edit"
          type="textarea"
          label={t(`${prefix}.description`)}
          value={field.value}
          setValue={field.onChange}
          maxLength={MAX_DESCRIPTION_LENGTH}
          hint={t(`${prefix}.descriptionHint`, { max: MAX_DESCRIPTION_LENGTH })}
          errorMessage={errors.description?.message}
        />
      )}
    />
  );
}
