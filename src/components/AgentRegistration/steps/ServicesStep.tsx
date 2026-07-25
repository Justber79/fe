"use client";
import { ApiOptionLists, EntityTableName } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle } from "../styled";
import { ProfileCompletionData } from "../types";

type ServicesData = Pick<ProfileCompletionData, "services" | "clientLanguageIds">;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9375rem;
  color: var(--color-midnight);

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--color-aubergine);
    cursor: pointer;
  }
`;

type Props = {
  data: ServicesData;
  onChange: (fields: Partial<ServicesData>) => void;
  optionLists?: ApiOptionLists;
};

export function ServicesStep({ data, onChange, optionLists }: Props) {
  const { t } = useTranslation();
  const languages = optionLists?.[EntityTableName.LANGUAGE] ?? [];
  const services = optionLists?.[EntityTableName.SERVICE] ?? [];

  const toggleService = (serviceId: number) => {
    const updated = data.services.includes(serviceId)
      ? data.services.filter((s) => s !== serviceId)
      : [...data.services, serviceId];
    onChange({ services: updated });
  };

  const toggleLanguage = (id: number) => {
    const updated = data.clientLanguageIds.includes(id)
      ? data.clientLanguageIds.filter((l) => l !== id)
      : [...data.clientLanguageIds, id];
    onChange({ clientLanguageIds: updated });
  };

  return (
    <div>
      <StepTitle>{t("agentRegistration.steps.services.title")}</StepTitle>
      <StepDescription>{t("agentRegistration.steps.services.description")}</StepDescription>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.services")}</FieldLabel>
        <CheckboxGrid>
          {services.map((service) => (
            <CheckboxLabel key={service.id}>
              <input
                type="checkbox"
                checked={data.services.includes(service.id)}
                onChange={() => toggleService(service.id)}
              />
              {service.title}
            </CheckboxLabel>
          ))}
        </CheckboxGrid>
      </FieldWrapper>

      {languages.length > 0 && (
        <FieldWrapper>
          <FieldLabel>{t("agentRegistration.fields.clientLanguages")}</FieldLabel>
          <CheckboxGrid>
            {languages.map((lang) => (
              <CheckboxLabel key={lang.id}>
                <input
                  type="checkbox"
                  checked={data.clientLanguageIds.includes(lang.id)}
                  onChange={() => toggleLanguage(lang.id)}
                />
                {lang.title}
              </CheckboxLabel>
            ))}
          </CheckboxGrid>
        </FieldWrapper>
      )}
    </div>
  );
}
