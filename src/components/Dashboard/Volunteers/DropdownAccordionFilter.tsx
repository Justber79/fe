import React from "react";
import AccordionFilter from "../common/CardsFilter/AccordionFilter";
import { FilterWrapper, ItemCount, OuterContainer, RelativeContainer } from "./styles";
import { FilterItem } from "../common/CardsFilter/types";

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
