"use client";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { Controller, useFormContext } from "react-hook-form";
import { type Locale } from "date-fns";
import { OpportunityDetailsFormData } from "./opportunityDetailsSchema";
import { DateFieldRow, DatePickerContainer, ErrorText, TimeInput, TimeInputWrapper } from "./styles";

const prefix = "dashboard.opportunityProfile.opportunityDetails";

type Props = {
  locale: Locale;
  t: (key: string) => string;
};

export const OpportunityEventDateTimeEdit = ({ locale, t }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Pick<OpportunityDetailsFormData, "eventDate" | "eventTime">>();
  return (
    <>
      <Controller
        name="eventDate"
        control={control}
        render={({ field }) => (
          <DateFieldRow data-testid="opportunity-details-event-date-edit">
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
          <DateFieldRow data-testid="opportunity-details-event-time-edit">
            <label htmlFor="eventTime">{t(`${prefix}.eventTime`)}</label>
            <TimeInputWrapper>
              <TimeInput
                id="eventTime"
                name="eventTime"
                type="time"
                value={field.value || ""}
                onChange={field.onChange}
                $hasError={!!errors.eventTime}
              />
              {errors.eventTime && <ErrorText>{errors.eventTime.message}</ErrorText>}
            </TimeInputWrapper>
          </DateFieldRow>
        )}
      />
    </>
  );
};
