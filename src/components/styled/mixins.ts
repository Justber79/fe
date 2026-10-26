import { css } from "styled-components";

export const fieldStackingMedia = "(max-width: 1023px)";

export const stackedFieldStyles = css`
  align-items: flex-start;
  flex-direction: column;
  gap: var(--spacing-8);

  > label {
    width: 100%;
    padding-top: 0;
  }

  > span,
  > div {
    width: 100%;
    min-width: 0;
  }
`;

export const responsiveFieldStyles = css`
  @media ${fieldStackingMedia} {
    ${stackedFieldStyles}
  }
`;

export const circleIconButtonStyles = css`
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

export const hyphenationStyles = css`
  white-space: normal; /* Allows text to wrap */
  overflow-wrap: break-word; /* Ensures long words break to fit */
  word-break: break-word; /* Fallback for older browsers for word breaking */

  /* Enable automatic hyphenation */
  hyphens: auto;
  -webkit-hyphens: auto; /* For WebKit browsers (Safari, Chrome) */
  -ms-hyphens: auto; /* For Internet Explorer/Edge */
`;
