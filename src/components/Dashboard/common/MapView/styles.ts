import Link from "next/link";
import styled, { keyframes } from "styled-components";

export const StyledMapContainer = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: var(--dashboard-map-border-radius);
  border: var(--dashboard-map-border);

  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: var(--dashboard-map-border-radius);
    z-index: 0;
  }
  .leaflet-popup-content p {
    margin: 0;
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
  width: 100%;
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
`;

export const PopupLink = styled(Link)`
  text-decoration: none;
  padding: var(--dashboard-map-popup-link-padding);
  background-color: var(--color-orchid-subtle);
  border-radius: var(--dashboard-map-popup-link-border-radius);
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-popup-link-gap);
  &:hover {
    background-color: var(--color-orchid);
  }
`;

export const PopupCardHeader = styled.p`
  font-size: var(--dashboard-map-popup-card-header-font-size);
  color: var(--color-black);
  font-weight: var(--dashboard-map-popup-card-header-font-weight);
  margin: 0;
`;

export const BerlinRacPopupContainer = styled.div`
  padding: var(--dashboard-map-popup-link-padding);
  background-color: var(--color-orchid-subtle);
  border-radius: var(--dashboard-map-popup-link-border-radius);
  display: flex;
  flex-direction: column;
  // gap: var(--dashboard-map-popup-link-gap);
  &:hover {
    background-color: var(--color-orchid);
  }
`;

export const BerlinRacCopyAddressWrapper = styled.div`
  align-self: end;
  position: absolute;
`;

export const BerlinRacAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const LegendCard = styled.div`
  background: white;
  padding: 12px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-family: sans-serif;
  font-size: 13px;
  color: #333;
`;

export const LegendTitle = styled.strong`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #111;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const IconSlot = styled.div`
  width: 50px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: auto;

    &.ngo-pin {
      filter: hue-rotate(90deg) saturate(0.8);
    }

    &.custom-icon {
      border-radius: 50%;
      object-fit: contain;
    }
  }
`;

export const ScrollZoomContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
