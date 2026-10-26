import styled from "styled-components";
import { CaretDownIcon } from "@phosphor-icons/react";
import { forwardRef, type SelectHTMLAttributes } from "react";

const Container = styled.span`
  display: inline-flex;
  position: relative;
  max-width: 100%;
  vertical-align: middle;

  > svg {
    position: absolute;
    right: var(--spacing-16);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-midnight);
    pointer-events: none;
  }
`;

const Control = styled.select`
  appearance: none;
  max-width: 100%;
  padding: var(--spacing-16);
  padding-right: var(--spacing-48);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  color: var(--color-midnight);
  background: var(--color-white);
  font-family: var(--bs-body-font-family);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  font-weight: var(--font-weight-regular);
  min-height: var(--spacing-48);
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    border: var(--editableField-border-focus);
  }
`;

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <Container className={className}>
      <Control {...props} ref={ref}>
        {children}
      </Control>
      <CaretDownIcon size={20} aria-hidden />
    </Container>
  );
});
