import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FieldGroup } from "../styled";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { Lang } from "need4deed-sdk";
import { ErrorMessage } from "@/components/core/common";

export default function MainCommunicationField({
  prefix,
  languagesForForm,
}: {
  prefix: string;
  languagesForForm: {
    id: number;
    title: Record<Lang, string>;
  }[];
}) {
  const { control } = useFormContext<OpportunityDetailsFormData>();
  const { t } = useTranslation();

  return (
    <Controller
      name="mainCommunication"
      control={control}
      render={({ field, fieldState }) => (
        <FieldGroup>
          <label>{t(`${prefix}.mainCommunication`)}</label>
          <div>
            <LanguageFields
              languages={field.value}
              onChange={field.onChange}
              t={t}
              availableLanguages={languagesForForm}
              showLevel={false}
            />
            {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
          </div>
        </FieldGroup>
      )}
    />
  );
}
