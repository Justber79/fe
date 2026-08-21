import { css } from "styled-components";

// Small circular "+"/pencil icon-button treatment shared by the agent
// contact list's add/edit buttons and the Agents table header's "create
// agent" button (fe#911).
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
