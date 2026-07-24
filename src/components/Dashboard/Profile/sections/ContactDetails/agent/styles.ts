import styled from "styled-components";

const iconButtonBase = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: var(--border-width-thin) solid var(--color-aubergine);
  background-color: var(--color-white);
  color: var(--color-aubergine);
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: var(--color-aubergine-subtle);
  }
`;

export const EditIconButton = styled.button`
  ${iconButtonBase}
`;

export const AddContactRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const AddContactButton = styled.button`
  ${iconButtonBase}
`;
