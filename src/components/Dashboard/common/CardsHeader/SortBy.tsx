import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";
import { SortOrder } from "need4deed-sdk";

const SortByContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-cards-header-sortBy-container-gap);
`;

const SortBySwitcherContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
`;

const OptionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  gap: var(--dashboard-cards-header-sortBy-options-gap);
  background: var(--color-orchid);
  padding: var(--dashboard-cards-header-sortBy-options-padding);
  border-radius: var(--dashboard-cards-header-sortBy-option-button-border-radius);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
`;

const OptionButton = styled.button`
  padding: var(--dashboard-cards-header-sortBy-option-button-padding);
  background: var(--color-orchid-subtle);
  border-color: transparent;
  border-radius: var(--dashboard-cards-header-sortBy-option-button-border-radius);
  cursor: pointer;
`;

export type SortOption = { value: string; label: string };

interface Props {
  sortOrder: string;
  onChange?: OnChangeSortOrder;
  extraOptions?: SortOption[];
}

export type OnChangeSortOrder = (value: string) => void;

export default function SortBy({ onChange, sortOrder, extraOptions }: Props) {
  const { t } = useTranslation();
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const sortByOptions: SortOption[] = [
    { value: SortOrder.NewToOld, label: t("dashboard.sortBy.newToOld") },
    { value: SortOrder.OldToNew, label: t("dashboard.sortBy.oldToNew") },
    ...(extraOptions ?? []),
  ];

  const handleChange = (value: string) => {
    setIsOptionsVisible(false);
    if (onChange) onChange(value);
  };

  const visibleOptions = sortByOptions.filter((o) => o.value !== sortOrder);

  return (
    <SortByContainer>
      <Paragraph fontWeight={400}>{t("dashboard.sortBy.sortBy")}:</Paragraph>

      <SortBySwitcherContainer>
        <Paragraph fontWeight={600}>{sortByOptions.find((o) => o.value === sortOrder)?.label}</Paragraph>

        {isOptionsVisible && (
          <OptionsDiv>
            {visibleOptions.map((o) => (
              <OptionButton key={o.value} onClick={() => handleChange(o.value)}>
                <Paragraph>{o.label}</Paragraph>
              </OptionButton>
            ))}
          </OptionsDiv>
        )}
      </SortBySwitcherContainer>

      <CircleArrow
        style={{ marginLeft: "var(--dashboard-cards-header-sortBy-circle-arrow-margin-left)" }}
        direction={isOptionsVisible ? "up" : "down"}
        color="orchid"
        isFilled
        onClick={() => setIsOptionsVisible(!isOptionsVisible)}
      />
    </SortByContainer>
  );
}
