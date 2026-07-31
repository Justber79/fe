import { useFormContext, Controller } from "react-hook-form";
import { OpportunityDetailsFormData } from "../../Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { DateFieldRow, DatePickerContainer, TimeInputWrapper, TimeInput } from "../styled";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { de, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export default function EventDateTimeFields({ prefix }: { prefix: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;

  return (
    <>
      <Controller
        name="eventDate"
        control={control}
        render={({ field }) => (
          <DateFieldRow>
            <label>{t(`${prefix}.eventDate`)}</label>
            <DatePickerContainer>
              <DatePickerWithLabel
                date={field.value ?? undefined}
                onSelect={(d) => field.onChange(d ?? null)}
                locale={locale}
                allowFuture
              />
            </DatePickerContainer>
          </DateFieldRow>
        )}
      />
      <Controller
        name="eventTime"
        control={control}
        render={({ field }) => (
          <DateFieldRow>
            <label htmlFor="new-opp-eventTime">{t(`${prefix}.eventTime`)}</label>
            <TimeInputWrapper>
              <TimeInput
                id="new-opp-eventTime"
                type="time"
                value={field.value || ""}
                onChange={field.onChange}
                $hasError={!!errors.eventTime}
              />
            </TimeInputWrapper>
          </DateFieldRow>
        )}
      />
    </>
  );
}
