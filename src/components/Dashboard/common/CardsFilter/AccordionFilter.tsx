import { useRef, useState } from "react";
import styled from "styled-components";
import { ButtonSpan, Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";
import { Checkbox, CheckButton } from "@/components/core/button";
import { useClickOutside } from "@/hooks";
import { FilterItem } from "./types";

interface Props {
  header: string;
  items?: FilterItem[];
  groupedItems?: GroupedFilterItem[];
  groupedItemsDisplayType?: "checkbox" | "button";
  isDropdownFilter?: boolean;
}
interface GroupedFilterItem {
  label: string;
  items: FilterItem[];
}

export default function AccordionFilter({
  header,
  items,
  groupedItems,
  groupedItemsDisplayType = "checkbox",
  isDropdownFilter = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGroupItemCheckbox = groupedItemsDisplayType === "checkbox";

  const openContainerRef = useRef(null);

  const checkboxHeight = getComputedStyle(document.documentElement).getPropertyValue(
    "--opportunities-filters-content-accordion-options-checkbox-height",
  );

  const groupCheckboxHeight = getComputedStyle(document.documentElement).getPropertyValue(
    "--opportunities-filters-content-accordion-group-options-checkbox-height",
  );

  const GroupItemCheckComponent = isGroupItemCheckbox ? Checkbox : CheckButton;

  useClickOutside(openContainerRef, () => setIsOpen(false));

  return (
    <FilterContainer ref={openContainerRef}>
      <FilterHeaderContainer
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        $isDropdownFilter={isDropdownFilter}
      >
        <ButtonSpan color="var(--color-midnight)" fontSize="20px" fontWeight={600}>
          {header}
        </ButtonSpan>
        <CircleArrow direction={isOpen ? "up" : "down"} color="orchid" isFilled />
      </FilterHeaderContainer>

      {isOpen && items && (
        <OptionsContainer $isDropdownFilter={isDropdownFilter}>
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

// export interface FilterItem extends Pick<CheckboxProps, "onChange"> {
//   label: string;
//   checked: boolean;
// }

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const FilterHeaderContainer = styled.button<{ $isDropdownFilter?: boolean }>(({ $isDropdownFilter }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "0",
  textAlign: "left",
  borderTop: $isDropdownFilter
    ? "none"
    : "var(--opportunities-filters-content-accordion-header-border-top) solid var(--color-orchid)",
  paddingTop: "var(--opportunities-filters-content-accordion-header-padding-top)",
}));

const OptionsContainer = styled.div<{ $isDropdownFilter?: boolean }>(({ $isDropdownFilter }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "var(--opportunities-filters-content-accordion-options-gap)",
  maxHeight: "var(--opportunities-filters-content-accordion-options-max-height)",
  overflowY: "auto",

  ...($isDropdownFilter && {
    background: "var(--color-white)",
    padding: "var(--dropdown-filters-content-accordion-padding)",
    border: "var(--dropdown-filters-content-accordion-border)",
    borderRadius: "var(--dropdown-filters-content-accordion-border-radius)",
  }),
}));

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
