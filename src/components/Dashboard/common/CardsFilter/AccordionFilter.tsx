import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { ButtonSpan, Paragraph } from "@/components/styled/text";
import CircleArrow from "@/components/svg/CircleArrow";
import { Checkbox, CheckButton } from "@/components/core/button";
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

interface DropdownPosition {
  top: number;
  right: number;
  maxHeight: number;
}

const findHorizontalScrollParent = (element: HTMLElement | null) => {
  let parent = element?.parentElement;

  while (parent) {
    const overflowX = getComputedStyle(parent).overflowX;
    if (overflowX === "auto" || overflowX === "scroll") return parent;
    parent = parent.parentElement;
  }

  return null;
};

const cssVar = (name: string, fallback: string) =>
  (typeof document !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue(name).trim()) ||
  fallback;

export default function AccordionFilter({
  header,
  items,
  groupedItems,
  groupedItemsDisplayType = "checkbox",
  isDropdownFilter = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const isGroupItemCheckbox = groupedItemsDisplayType === "checkbox";

  const openContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const checkboxHeight = cssVar("--opportunities-filters-content-accordion-options-checkbox-height", "18px");

  const groupCheckboxHeight = cssVar("--opportunities-filters-content-accordion-group-options-checkbox-height", "16px");

  const GroupItemCheckComponent = isGroupItemCheckbox ? Checkbox : CheckButton;

  const updateDropdownPosition = useCallback(() => {
    const headerRect = headerRef.current?.getBoundingClientRect();
    if (!headerRect) return;

    const availableBelow = window.innerHeight - headerRect.bottom - 12;
    const availableAbove = headerRect.top - 12;
    const openAbove = availableBelow < 200 && availableAbove > availableBelow;
    const maxHeight = Math.max(120, Math.min(320, openAbove ? availableAbove : availableBelow));

    setDropdownPosition({
      top: openAbove ? Math.max(8, headerRect.top - maxHeight - 4) : headerRect.bottom + 4,
      right: Math.max(8, window.innerWidth - headerRect.right),
      maxHeight,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!openContainerRef.current?.contains(target) && !optionsContainerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isDropdownFilter) return;

    updateDropdownPosition();
    const closeDropdown = () => setIsOpen(false);
    const scrollContainer = findHorizontalScrollParent(headerRef.current);

    scrollContainer?.addEventListener("scroll", closeDropdown);
    window.addEventListener("scroll", closeDropdown);
    window.addEventListener("resize", closeDropdown);
    return () => {
      scrollContainer?.removeEventListener("scroll", closeDropdown);
      window.removeEventListener("scroll", closeDropdown);
      window.removeEventListener("resize", closeDropdown);
    };
  }, [isDropdownFilter, isOpen, updateDropdownPosition]);

  const itemOptions =
    isOpen && items ? (
      <OptionsContainer
        ref={optionsContainerRef}
        $isDropdownFilter={isDropdownFilter}
        $dropdownPosition={dropdownPosition}
      >
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
    ) : null;

  return (
    <FilterContainer ref={openContainerRef}>
      <FilterHeaderContainer
        ref={headerRef}
        type="button"
        aria-expanded={isOpen}
        disabled={isDropdownFilter && !items?.length}
        onClick={() => setIsOpen(!isOpen)}
        $isDropdownFilter={isDropdownFilter}
      >
        <ButtonSpan color="var(--color-midnight)" fontSize="20px" fontWeight={600}>
          {header}
        </ButtonSpan>
        <CircleArrow direction={isOpen ? "up" : "down"} color="orchid" isFilled />
      </FilterHeaderContainer>

      {isDropdownFilter && typeof document !== "undefined"
        ? dropdownPosition && createPortal(itemOptions, document.body)
        : itemOptions}

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

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-filters-content-filter-container-gap);
`;

const FilterHeaderContainer = styled.button<{ $isDropdownFilter?: boolean }>(({ $isDropdownFilter }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
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
  ...($isDropdownFilter && {
    "&:disabled": {
      cursor: "not-allowed",
    },
  }),
}));

const OptionsContainer = styled.div<{
  $isDropdownFilter?: boolean;
  $dropdownPosition?: DropdownPosition | null;
}>(({ $isDropdownFilter, $dropdownPosition }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "var(--opportunities-filters-content-accordion-options-gap)",
  maxHeight: "var(--opportunities-filters-content-accordion-options-max-height)",
  overflowY: "auto",

  ...($isDropdownFilter && {
    position: "fixed",
    top: $dropdownPosition?.top,
    right: $dropdownPosition?.right,
    maxHeight: $dropdownPosition?.maxHeight,
    zIndex: 1000,
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
