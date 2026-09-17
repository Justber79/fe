import Link from "next/link";
import styled, { keyframes } from "styled-components";

export const StyledMapContainer = styled.div`
  height: var(--dashboard-map-height);
  aspect-ratio: 1/1;
  border-radius: var(--dashboard-map-border-radius);
  border: var(--dashboard-map-border);

  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: var(--dashboard-map-border-radius);
  }
`;

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

export const LoadingMapCard = styled.div`
  height: var(--dashboard-map-height);
  aspect-ratio: 1/1;
  border-radius: var(--dashboard-map-border-radius);
  border: var(--dashboard-map-border);
  animation: ${pulse} 3s ease-in-out infinite;
`;

export const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  gap: var(--dashboard-map-container-gap);
`;

export const LoadingSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-sidebar-gap);
  padding: var(--dashboard-map-sidebar-padding);
  max-height: var(--dashboard-map-height);
  overflow-y: scroll;
  border-radius: var(--dashboard-map-border-radius);
  width: var(--dashboard-map-sidebar-width);
  animation: ${pulse} 3s ease-in-out infinite;
`;

export const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dashboard-map-popup-wrapper-gap);
  & > span:first-child {
    font-weight: bold;
  }
`;

export const MapContainer = styled.div`
  display: flex;
  width: 100%;
  gap: var(--dashboard-map-container-gap);
`;

export const MapSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-sidebar-gap);
  padding: var(--dashboard-map-sidebar-padding);
  max-height: var(--dashboard-map-height);
  overflow-y: scroll;
  width: var(--dashboard-map-sidebar-width);
`;

export const MarkerCard = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.$isActive ? "var(--color-orchid)" : "var(--color-orchid-subtle)")};
  justify-content: center;
  padding: var(--dashboard-map-marker-card-padding);
  border-radius: var(--card-border-radius);
  cursor: pointer;
`;

export const MarkerLabel = styled.span`
  text-align: left;
  margin-bottom: var(--dashboard-map-marker-label-margin-bottom);
  color: var(--color-grey-500);
  text-transform: uppercase;
  font-weight: bold;
`;

export const MapOpportunityList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-opp-list-gap);
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const MapOpportunityItem = styled.li`
  display: flex;
  gap: var(--dashboard-map-opp-item-gap);
  background: var(--color-white);
  padding: var(--dashboard-map-marker-card-padding);
  border-radius: var(--card-border-radius);
  font-weight: bold;
  text-align: center;
  align-items: center;
`;

export const PopupContentWrapper = styled.div`
  padding: var(--dashboard-map-popup-wrapper-padding);
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-popup-wrapper-gap);
`;

export const PopupHeader = styled.div`
  font-size: var(--dashboard-map-popup-font-size);
  font-weight: bold;
  color: var(--color-gray-500);
  text-transform: uppercase;
`;

export const PopupLink = styled(Link)`
  font-size: var(--dashboard-map-popup-link-font-size);
  font-weight: 600;
  text-decoration: none;
  padding: var(--dashboard-map-popup-link-padding);
  background-color: var(--color-orchid-subtle);
  border-radius: var(--dashboard-map-popup-link-border-radius);
  display: inline-block;
  && {
    color: var(--color-black);
  }
  &:hover {
    background-color: var(--color-orchid);
  }
`;
