"use client";
import { useState } from "react";
import styled from "styled-components";
import { Checkbox, CheckboxProps } from "@/components/core/button";
import { Heading4, Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";

export interface FilterItem extends Pick<CheckboxProps, "onChange"> {
  label: string;
  checked: boolean;
}

export interface GroupedFilterItem {
  label: string;
  items: FilterItem[];
}

interface Props {
  header: string;
  items?: FilterItem[];
  groupedItems?: GroupedFilterItem[];
}

// Checkbox renders an <svg width/height>, which can't take var(); resolve the
// token. Only called client-side: the filter panel opens on user action.
const cssVar = (name: string, fallback: string) =>
  (typeof document !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue(name).trim()) ||
  fallback;

export default function AccordionFilter({ header, items, groupedItems }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const checkboxSize = cssVar("--opportunities-filters-content-accordion-options-checkbox-height", "24px");
  const groupCheckboxSize = cssVar("--opportunities-filters-content-accordion-group-options-checkbox-height", "20px");

  return (
    <FilterContainer>
      <FilterHeaderContainer>
        <Heading4 color="var(--color-midnight)">{header}</Heading4>
        <CircleArrow direction={isOpen ? "up" : "down"} color="orchid" isFilled onClick={() => setIsOpen(!isOpen)} />
      </FilterHeaderContainer>

      {isOpen && items && (
        <OptionsContainer>
          {items.map((item) => (
            <Checkbox
              key={item.label}
              width={checkboxSize}
              height={checkboxSize}
              onChange={item.onChange}
              label={item.label}
              checked={item.checked}
            />
          ))}
        </OptionsContainer>
      )}

      {isOpen && groupedItems && (
        <OptionsContainer>
          {groupedItems.map((group) => (
            <GroupContainer key={group.label}>
              <Paragraph>{group.label}</Paragraph>
              <GroupOptionsContainer>
                {group.items.map((item) => (
                  <Checkbox
                    key={item.label}
                    width={groupCheckboxSize}
                    height={groupCheckboxSize}
                    onChange={item.onChange}
                    label={item.label}
                    labelFontSize="var(--opportunities-filters-content-accordion-group-options-checkbox-labelFontSize)"
                    checked={item.checked}
                  />
                ))}
              </GroupOptionsContainer>
            </GroupContainer>
          ))}
        </OptionsContainer>
      )}
    </FilterContainer>
  );
}

/* Styles */

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const FilterHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: var(--opportunities-filters-content-accordion-header-border-top) solid var(--color-orchid);
  padding-top: var(--opportunities-filters-content-accordion-header-padding-top);
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-accordion-options-gap);
  max-height: var(--opportunities-filters-content-accordion-options-max-height);
  overflow-y: auto;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-accordion-options-gap);
`;

const GroupOptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
