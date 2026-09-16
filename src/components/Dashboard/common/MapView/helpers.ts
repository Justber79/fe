import { LatLngExpression } from "leaflet";

export type Markers = Array<{ lat: number; lon: number; label?: string; onClick?: () => void }>;

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];

export const mapContainerStyle = {
  height: "var(--dashboard-map-height)",
  aspectRatio: "1/1",
  borderRadius: "var(--dashboard-map-border-radius)",
  border: "var(--dashboard-map-border)",
};
