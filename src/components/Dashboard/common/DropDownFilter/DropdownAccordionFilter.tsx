import React from "react";
import AccordionFilter from "../CardsFilter/AccordionFilter";
import { FilterWrapper, ItemCount, OuterContainer, RelativeContainer } from "./styles";
import { FilterItem } from "../CardsFilter/types";

type Props = {
  items: FilterItem[];
  width: string;
};

export default function DropdownAccordionFilter({ items, width }: Props) {
  return (
    <OuterContainer>
      <ItemCount $width={width}>({items.filter((item) => item.checked).length})</ItemCount>
      <RelativeContainer>
        <FilterWrapper $width={width}>
          <AccordionFilter header={""} items={items} isDropdownFilter={true} />
        </FilterWrapper>
      </RelativeContainer>
    </OuterContainer>
  );
}
