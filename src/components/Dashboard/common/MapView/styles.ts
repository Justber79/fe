import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    background-color: var(--color-grey-50);
    opacity: 1;
  }
  50% {
    background-color: var(--color-grey-200);
    opacity: 0.6;
  }
  100% {
    background-color: var(--color-grey-50);
    opacity: 1;
  }
`;

export const LoadingMapView = styled.div`
  height: var(--dashboard-map-height);
  aspect-ratio: 1/1;
  border-radius: var(--dashboard-map-border-radius);
  border: var(--dashboard-map-border);
  animation: ${pulse} 3s ease-in-out infinite;
`;
