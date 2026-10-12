import React from "react";
import AccordionFilter from "../CardsFilter/AccordionFilter";
import { FilterWrapper, ItemCount, OuterContainer, RelativeContainer } from "./styles";
import { FilterItem } from "../CardsFilter/types";

type Props = {
  items: FilterItem[];
};

export default function DropdownAccordionFilter({ items }: Props) {
  return (
    <OuterContainer>
      <ItemCount>({items.filter((item) => item.checked).length})</ItemCount>
      <RelativeContainer>
        <FilterWrapper>
          <AccordionFilter header={""} items={items} isDropdownFilter={true} />
        </FilterWrapper>
      </RelativeContainer>
    </OuterContainer>
  );
}
