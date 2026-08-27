"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { EventN4DType, Lang, type ApiEventN4DCreate } from "need4deed-sdk";

import { PageLayout } from "@/components/Layout";
import { useCreateEvent, useEvent, useUpdateEvent } from "@/hooks";

import { StepDateTime } from "./StepDateTime";
import { StepLocation } from "./StepLocation";
import { DESCRIPTION_MAX, StepTitle } from "./StepTitle";

export interface EventFormData {
  type: EventN4DType;
  title: string;
  description: string;
  street: string;
  houseNumber: string;
  postcode: string;
  registrationLink: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const TOTAL_STEPS = 3;

interface Props {
  eventId?: number;
}

function dateParts(value?: Date) {
  if (!value) return { date: "", time: "" };
  const parsed = new Date(value);
  return {
    date: `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`,
    time: `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`,
  };
}

function parseAddress(address = "") {
  const match = address.match(/^(.*)\s+(\S+),\s*(\d{5})/);
  return match
    ? { street: match[1], houseNumber: match[2], postcode: match[3] }
    : { street: address, houseNumber: "", postcode: "" };
}

export function CreateEvent({ eventId }: Props) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDate = searchParams.get("date") ?? "";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    type: EventN4DType.WORKSHOP,
    title: "",
    description: "",
    street: "",
    houseNumber: "",
    postcode: "",
    registrationLink: "",
    startDate: prefilledDate,
    startTime: "",
    endDate: prefilledDate,
    endTime: "",
  });
  const [initializedEventId, setInitializedEventId] = useState<number | null>(null);
  const { data: editingEvent, isLoading } = useEvent(eventId);

  useEffect(() => {
    if (!eventId || !editingEvent || initializedEventId === eventId) return;
    const start = dateParts(editingEvent.date);
    const end = dateParts(editingEvent.dateEnd ?? editingEvent.date);
    setFormData({
      type: editingEvent.type,
      title: editingEvent.title,
      description: editingEvent.description,
      ...parseAddress(editingEvent.address),
      registrationLink: editingEvent.linkRSVP,
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
    });
    setInitializedEventId(eventId);
  }, [editingEvent, eventId, initializedEventId]);

  const update = (fields: Partial<EventFormData>) => setFormData((prev) => ({ ...prev, ...fields }));

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => {
    if (step === 1) {
      router.push(`/${i18n.language}/dashboard/calendar`);
    } else {
      setStep((s) => s - 1);
    }
  };
  const handleCancel = () => router.push(`/${i18n.language}/dashboard/calendar`);

  const returnToEvents = () => router.push(`/${i18n.language}/dashboard/calendar`);
  const createEvent = useCreateEvent(returnToEvents);
  const updateEvent = useUpdateEvent(eventId ?? 0, returnToEvents);

  const toPayload = (): ApiEventN4DCreate => ({
    date: new Date(`${formData.startDate}T${formData.startTime}`),
    dateEnd: new Date(`${formData.endDate}T${formData.endTime}`),
    type: formData.type,
    linkRSVP: formData.registrationLink,
    address: `${formData.street} ${formData.houseNumber}, ${formData.postcode} Berlin`,
    active: true,
    translations: [
      {
        language: i18n.language === Lang.DE ? Lang.DE : Lang.EN,
        title: formData.title,
        menuTitle: formData.title,
        description: formData.description,
        shortDescription: formData.description,
      },
    ],
  });

  const handleSubmit = () => (eventId ? updateEvent.mutate(toPayload()) : createEvent.mutate(toPayload()));

  const isNextEnabled = () => {
    if (step === 1)
      return (
        formData.title.trim().length > 0 &&
        formData.description.trim().length > 0 &&
        formData.description.length <= DESCRIPTION_MAX
      );
    if (step === 2)
      return (
        formData.street.trim().length > 0 &&
        formData.houseNumber.trim().length > 0 &&
        formData.postcode.trim().length > 0 &&
        /^https?:\/\//.test(formData.registrationLink)
      );
    if (step === 3) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      return Boolean(formData.startDate && formData.startTime && formData.endDate && formData.endTime && end > start);
    }
    return false;
  };

  if (eventId && isLoading)
    return (
      <PageLayout background="var(--color-orchid-subtle)">
        <PageContent />
      </PageLayout>
    );
  if (eventId && !isLoading && !editingEvent)
    return (
      <PageLayout background="var(--color-orchid-subtle)">
        <PageContent />
      </PageLayout>
    );

  return (
    <PageLayout background="var(--color-orchid-subtle)">
      <PageContent>
        <ProgressBar>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <ProgressSegment key={i} $active={i < step} />
          ))}
        </ProgressBar>

        <Card>
          {step === 1 && (
            <StepTitle
              type={formData.type}
              title={formData.title}
              description={formData.description}
              onChange={update}
              onNext={handleNext}
              onCancel={handleCancel}
              isNextEnabled={isNextEnabled()}
            />
          )}
          {step === 2 && (
            <StepLocation
              street={formData.street}
              houseNumber={formData.houseNumber}
              postcode={formData.postcode}
              registrationLink={formData.registrationLink}
              onChange={update}
              onNext={handleNext}
              onBack={handleBack}
              isNextEnabled={isNextEnabled()}
            />
          )}
          {step === 3 && (
            <StepDateTime
              startDate={formData.startDate}
              startTime={formData.startTime}
              endDate={formData.endDate}
              endTime={formData.endTime}
              onChange={update}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitEnabled={isNextEnabled() && !createEvent.isPending && !updateEvent.isPending}
            />
          )}
        </Card>
      </PageContent>
    </PageLayout>
  );
}

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-32);
  padding: var(--spacing-48) var(--spacing-24) var(--spacing-48);
  width: 100%;
  box-sizing: border-box;
`;

const ProgressBar = styled.div`
  display: flex;
  gap: var(--spacing-8);
  width: 100%;
  max-width: 800px;
`;

const ProgressSegment = styled.div<{ $active: boolean }>`
  flex: 1;
  height: var(--create-event-progress-height);
  border-radius: var(--create-event-progress-border-radius);
  background: ${({ $active }) => ($active ? "var(--color-midnight)" : "var(--color-orchid)")};
  transition: background 0.2s ease;
`;

const Card = styled.div`
  background: var(--color-white);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-32);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;
