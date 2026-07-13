"use client";
import { Modal } from "@/components/core/modal/Modal";
import { createVolunteerTypeLabelMap } from "../../common";
import {
  ModalContainer,
  ModalTitle,
  OptionDescription,
  OptionItem,
  OptionLabel,
  OptionsContainer,
  RadioOption,
} from "../../common/dialogStyles";
import { de, enUS } from "date-fns/locale";
import { ApiOpportunityGet, VolunteerStateTypeType } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { AccompanyingTypeChangeForm } from "./AccompanyingTypeChangeForm";
import { EventTypeChangeForm } from "./EventTypeChangeForm";
import { PlainTypeChangeForm } from "./PlainTypeChangeForm";
import { TypeChangeButtons } from "./TypeChangeButtons";

const ACCOMPANYING_TYPES = [VolunteerStateTypeType.ACCOMPANYING, VolunteerStateTypeType.REGULAR_ACCOMPANYING];

const SELECTABLE_TYPES = [
  VolunteerStateTypeType.ACCOMPANYING,
  VolunteerStateTypeType.REGULAR,
  VolunteerStateTypeType.EVENTS,
];

type Props = {
  onClose: () => void;
  opportunity: ApiOpportunityGet;
};

export const ChangeOpportunityTypeDialog = ({ onClose, opportunity }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);
  const currentType = opportunity.volunteerType;

  const [selected, setSelected] = useState(currentType);

  const options = SELECTABLE_TYPES.map((type) => ({
    value: type,
    label: volunteerTypeLabelMap[type],
    description: t(`dashboard.opportunityProfile.typeModal.options.${type}`),
  }));

  const isAccompanying = ACCOMPANYING_TYPES.includes(currentType);
  const showWarning = isAccompanying && !ACCOMPANYING_TYPES.includes(selected);

  const showAccompanyingForm = selected === VolunteerStateTypeType.ACCOMPANYING && !isAccompanying;

  const showEventForm = selected === VolunteerStateTypeType.EVENTS && currentType !== VolunteerStateTypeType.EVENTS;

  const isNoop = selected === currentType;

  return (
    <Modal isOpen onClose={onClose}>
      <ModalContainer data-testid="change-opportunity-type-dialog">
        <ModalTitle>{t("dashboard.opportunityProfile.typeModal.title")}</ModalTitle>

        <OptionsContainer>
          {options.map(({ value, label, description }) => (
            <OptionItem key={value}>
              <RadioOption>
                <input
                  type="radio"
                  name="opportunity-type"
                  checked={selected === value}
                  onChange={() => setSelected(value)}
                />
                <OptionLabel>{label}</OptionLabel>
              </RadioOption>
              <OptionDescription>{description}</OptionDescription>
            </OptionItem>
          ))}
        </OptionsContainer>

        {showWarning && <WarningBox>{t("dashboard.opportunityProfile.typeModal.accompanyingWarning")}</WarningBox>}

        {showAccompanyingForm && (
          <AccompanyingTypeChangeForm opportunityId={opportunity.id} locale={locale} onCancel={onClose} />
        )}

        {showEventForm && <EventTypeChangeForm opportunityId={opportunity.id} locale={locale} onCancel={onClose} />}

        {!showAccompanyingForm && !showEventForm && !isNoop && (
          <PlainTypeChangeForm opportunityId={opportunity.id} opportunityType={selected} onCancel={onClose} />
        )}

        {isNoop && (
          <TypeChangeButtons
            onCancel={onClose}
            onSave={onClose}
            cancelLabel={t("dashboard.opportunityProfile.typeModal.cancel")}
            saveLabel={t("dashboard.opportunityProfile.typeModal.save")}
          />
        )}
      </ModalContainer>
    </Modal>
  );
};

const WarningBox = styled.div`
  padding: var(--spacing-12) var(--spacing-16);
  border-radius: var(--border-radius-xs);
  background-color: var(--color-orange-50);
  border: var(--border-width-thin) solid var(--color-orange-200);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-20);
  color: var(--color-orange-700);
`;
