import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";

export default function NumberOfVolunteersField({ prefix }: { prefix: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();
  const { t } = useTranslation();

  return (
    <Controller
      name="numberOfVolunteers"
      control={control}
      render={({ field }) => (
        <EditableField
          mode="edit"
          type="stepper"
          label={t(`${prefix}.numberOfVolunteers`)}
          value={field.value}
          setValue={field.onChange}
          errorMessage={errors.numberOfVolunteers?.message}
        />
      )}
    />
  );
}
