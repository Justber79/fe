import { LatLngExpression } from "leaflet";

export type Markers = Array<{ lat: number; lon: number; label?: string; onClick?: () => void }>;

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];
