"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { type Locale } from "date-fns";
import { Id, OpportunityType, VolunteerStateTypeType } from "need4deed-sdk";
import { z } from "zod";
import { OpportunityEventDateTimeEdit } from "../../../OpportunityDetails/OpportunityEventDateTimeEdit";
import { useUpdateOpportunityType } from "@/hooks/useUpdateOpportunityType";
import { TypeChangeButtons } from "./TypeChangeButtons";
import { dateFromLocalDateAndTimeString, formatToUtcTime } from "@/utils";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const createEventDateTimeSchema = (t: (key: string) => string) =>
  z.object({
    eventDate: z.date({
      message: t("dashboard.opportunityProfile.typeModal.eventDateRequired"),
    }),
    eventTime: z
      .string()
      .min(1, t("dashboard.opportunityProfile.typeModal.eventTimeRequired"))
      .regex(timeRegex, t("dashboard.opportunityProfile.typeModal.invalidEventTime")),
  });

type EventFormData = z.infer<ReturnType<typeof createEventDateTimeSchema>>;

type Props = {
  opportunityId: Id;
  locale: Locale;
  onCancel: () => void;
};

export const EventTypeChangeForm = ({ opportunityId, locale, onCancel }: Props) => {
  const { t } = useTranslation();
  const { mutateAsync: updateType, isPending } = useUpdateOpportunityType(opportunityId);

  const methods = useForm<EventFormData>({
    resolver: zodResolver(createEventDateTimeSchema(t)),
    mode: "onChange",
    defaultValues: {
      eventDate: new Date(),
      eventTime: "",
    },
  });

  const handleSave = async () => {
    const valid = await methods.trigger();
    if (!valid) return;

    const values = methods.getValues();
    const eventDateTime = dateFromLocalDateAndTimeString(values.eventDate, values.eventTime);

    await updateType({
      opportunity_type: VolunteerStateTypeType.EVENTS as OpportunityType,
      event: {
        date: eventDateTime.toISOString(),
        time: formatToUtcTime(eventDateTime),
      },
    });
    onCancel();
  };

  return (
    <>
      <FormProvider {...methods}>
        <div>
          <OpportunityEventDateTimeEdit locale={locale} t={t} />
        </div>
      </FormProvider>
      <TypeChangeButtons
        onCancel={onCancel}
        onSave={handleSave}
        cancelLabel={t("dashboard.opportunityProfile.typeModal.cancel")}
        saveLabel={t("dashboard.opportunityProfile.typeModal.save")}
        loading={isPending}
      />
    </>
  );
};
