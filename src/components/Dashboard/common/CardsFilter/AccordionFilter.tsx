import { useState } from "react";
import styled from "styled-components";
import { Heading4, Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";
import { Checkbox, CheckboxProps, CheckButton } from "@/components/core/button";

interface Props {
  header: string;
  items?: FilterItem[];
  groupedItems?: GroupedFilterItem[];
  groupedItemsDisplayType?: "checkbox" | "button";
}
interface GroupedFilterItem {
  label: string;
  items: FilterItem[];
}

export default function AccordionFilter({ header, items, groupedItems, groupedItemsDisplayType = "checkbox" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGroupItemCheckbox = groupedItemsDisplayType === "checkbox";

  const checkboxHeight = getComputedStyle(document.documentElement).getPropertyValue(
    "--opportunities-filters-content-accordion-options-checkbox-height",
  );

  const groupCheckboxHeight = getComputedStyle(document.documentElement).getPropertyValue(
    "--opportunities-filters-content-accordion-group-options-checkbox-height",
  );

  const GroupItemCheckComponent = isGroupItemCheckbox ? Checkbox : CheckButton;

  return (
    <FilterContainer>
      <FilterHeaderContainer type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <Heading4 color="var(--color-midnight)">{header}</Heading4>
        <CircleArrow direction={isOpen ? "up" : "down"} color="orchid" isFilled />
      </FilterHeaderContainer>

      {isOpen && items && (
        <OptionsContainer>
          {items.map((item) => (
            <Checkbox
              key={item.label}
              width={checkboxHeight}
              height={checkboxHeight}
              onChange={item.onChange}
              label={item.label}
              checked={item.checked}
            />
          ))}
        </OptionsContainer>
      )}

      {isOpen && groupedItems && (
        <OptionsContainer>
          {groupedItems.map((groupeItem) => (
            <GroupContainer key={groupeItem.label}>
              <Paragraph>{groupeItem.label}</Paragraph>

              <GroupOptionsContainer>
                {groupeItem.items.map((item) => (
                  <GroupItemCheckComponent
                    key={item.label}
                    width={isGroupItemCheckbox ? groupCheckboxHeight : ""}
                    height={isGroupItemCheckbox ? groupCheckboxHeight : "46px"}
                    onChange={item.onChange}
                    label={item.label}
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

interface FilterItem extends Pick<CheckboxProps, "onChange"> {
  label: string;
  checked: boolean;
}

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const FilterHeaderContainer = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  border-top: var(--opportunities-filters-content-accordion-header-border-top) solid var(--color-orchid);
  padding-top: var(--opportunities-filters-content-accordion-header-padding-top);
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
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
  flex-flow: wrap;
  gap: var(--filters-accordion-group-options-gap);
`;
