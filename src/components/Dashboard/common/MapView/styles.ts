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

export const DistrictMapPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-container-gap);
  width: 100%;
`;

export const DistrictMapLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 280px);
  gap: var(--dashboard-map-container-gap);

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;

    & > section {
      order: 0;
    }

    ${StyledMapContainer} {
      order: 1;
      aspect-ratio: 4 / 3;
    }
  }
`;

export const DistrictMapSectionTitle = styled.h3`
  margin: 0 0 var(--spacing-8);
  font-size: var(--font-size-md);
`;

export const DistrictMapList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  max-height: 480px;
  overflow: auto;
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const DistrictMapListItem = styled.li`
  min-width: 0;
`;

export const DistrictMapButton = styled.button<{ $isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: var(--spacing-8) var(--spacing-12);
  border: 1px solid var(--color-grey-300);
  background: ${({ $isSelected }) => ($isSelected ? "var(--color-orchid-subtle)" : "var(--color-white)")};
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: var(--color-orchid-subtle);
  }
`;

export const DistrictCount = styled.strong`
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
`;

export const DistrictSelectedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-12);
`;

export const DistrictSelectedTitle = styled.h2`
  margin: 0;
  font-size: var(--font-size-lg);
`;

export const DistrictMapStatus = styled.p`
  margin: 0;
  color: var(--color-grey-700);
`;

export const DistrictCountChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

export const MapBucketChip = styled.span`
  display: inline-flex;
  gap: var(--spacing-4);
  align-items: center;
  padding: var(--spacing-8) var(--spacing-12);
  border: 1px solid var(--color-grey-300);
  border-radius: 999px;
  background: var(--color-grey-50);
`;

export const MapResultLink = styled(Link)`
  color: var(--color-black);
  font-weight: var(--font-weight-bold);
  text-decoration: underline;
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

export const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: var(--dashboard-map-container-gap);
`;

export const PopupContentWrapper = styled.div`
  max-height: var(--dashboard-map-popup-height);
  overflow-y: auto;
  padding: var(--dashboard-map-popup-wrapper-padding);
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-map-popup-wrapper-gap);
`;

export const PopupHeader = styled.div`
  font-size: var(--dashboard-map-popup-font-size);
  font-weight: var(--font-weight-bold);
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
  gap: var(--dashboard-map-berlin-rac-address-gap);
  margin-top: var(--dashboard-map-berlin-rac-address-margin-top);
`;

export const LegendCard = styled.div`
  background: var(--color-white);
  padding: var(--dashboard-map-legend-padding);
  border-radius: var(--dashboard-map-legend-border-radius);
  box-shadow: var(--dashboard-map-legend-box-shadow);
  font-family: var(--bs-body-font-family);
  font-size: var(--dashboard-map-legend-font-size);
  color: var(--color-black);
`;

export const LegendTitle = styled.strong`
  display: block;
  margin-bottom: var(--dashboard-map-legend-title-margin-bottom);
  font-size: var(--font-size-xs);
  cursor: pointer;
`;

export const LegendTitleNoContent = styled.strong`
  display: block;
  margin-bottom: var(--dashboard-map-legend-title-margin-bottom);
  font-size: var(--font-size-xs);
  color: var(--color-black);
  background: var(--color-white);
  padding: var(--dashboard-map-legend-padding);
  border-radius: var(--dashboard-map-legend-border-radius);
  box-shadow: var(--dashboard-map-legend-box-shadow);
  cursor: pointer;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--dashboard-map-legend-row-gap);
  margin-bottom: var(--dashboard-map-legend-row-margin-bottom);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const IconSlot = styled.div`
  width: var(--dashboard-map-legend-icon-slot-width);
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

    &.custom-other-rac-icon {
      filter: hue-rotate(150deg);
    }
  }
`;

export const ScrollZoomContainer = styled.div`
  display: flex;
  gap: var(--dashboard-map-container-gap);
  align-items: center;
`;

export const MapHelperWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const MapHelperText = styled.i`
  font-weight: 600;
`;
