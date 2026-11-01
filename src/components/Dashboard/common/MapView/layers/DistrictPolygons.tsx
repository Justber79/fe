import { GeoJSON, Pane, Polygon } from "react-leaflet";
import { ApiDistrictGeometryCollection } from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { Feature } from "geojson";
import { districtFillColors, MAP_AREA_RING, resolveCssColor } from "../helpers";

interface Props {
  districtGeometries: ApiDistrictGeometryCollection;
  onDistrictClick: (title: string) => void;
  selectedDistrictTitles: string[];
}

export const DistrictPolygons = ({ districtGeometries, onDistrictClick, selectedDistrictTitles }: Props) => {
  const [hoveredDistrictTitle, setHoveredDistrictTitle] = useState<string | null>(null);
  const geoJsonRef = useRef<L.GeoJSON>(null);
  const onDistrictClickRef = useRef(onDistrictClick);
  onDistrictClickRef.current = onDistrictClick;

  const { resolvedColors, inactiveColor, maskPathOptions } = useMemo(() => {
    const colors = Object.fromEntries(
      Object.entries(districtFillColors).map(([title, color]) => [title, resolveCssColor(color)]),
    );
    const inactive = resolveCssColor("var(--color-black)");
    return {
      resolvedColors: colors,
      inactiveColor: inactive,
      maskPathOptions: { fillColor: inactive, fillOpacity: 0.35, stroke: false },
    };
  }, []);

  const defaultColor = resolvedColors.Mitte;
  const selectedSet = useMemo(() => new Set(selectedDistrictTitles), [selectedDistrictTitles]);
  const selectedSetRef = useRef(selectedSet);
  selectedSetRef.current = selectedSet;
  const geometryKey = useMemo(
    () => districtGeometries.features.map(({ properties }) => properties?.title ?? "untitled").join("|"),
    [districtGeometries],
  );

  const maskPositions = useMemo(() => {
    const holes = districtGeometries.features.flatMap(({ geometry }) => {
      const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
      return polygons.flatMap((rings) => {
        const outerRing = rings[0];
        return outerRing ? [outerRing.map(([lng, lat]) => [lat, lng] as [number, number])] : [];
      });
    });
    return [MAP_AREA_RING, ...holes];
  }, [districtGeometries]);

  const getDistrictStyle = useCallback(
    (feature?: Feature) => {
      const title = feature?.properties?.title as string | undefined;
      const baseColor = title ? (resolvedColors[title] ?? defaultColor) : defaultColor;

      const isSelected = title ? selectedSet.has(title) : false;
      const isHovered = title === hoveredDistrictTitle;
      const hasActive = selectedSet.size > 0 || hoveredDistrictTitle !== null;

      return {
        fillColor: hasActive && !isSelected && !isHovered ? inactiveColor : baseColor,
        color: inactiveColor,
        weight: 1.5,
      };
    },
    [resolvedColors, defaultColor, selectedSet, hoveredDistrictTitle, inactiveColor],
  );

  useEffect(() => {
    geoJsonRef.current?.eachLayer((layer) => {
      const title = (layer as L.Layer & { feature?: Feature }).feature?.properties?.title;
      layer.unbindTooltip();
      if (typeof title !== "string" || !title) return;

      const isSelected = selectedSet.has(title);
      layer.bindTooltip(title, isSelected ? { permanent: true, direction: "center" } : undefined);
      if (isSelected) layer.openTooltip();
    });
  }, [selectedSet]);

  const handleEachFeature = useCallback((feature: Feature, layer: L.Layer) => {
    const title = feature.properties?.title;
    if (!title) return;

    const isSelected = selectedSetRef.current.has(title);
    layer.bindTooltip(title, isSelected ? { permanent: true, direction: "center" } : undefined);
    if (isSelected) layer.openTooltip();

    layer.on({
      mouseover: () => setHoveredDistrictTitle(title),
      mouseout: () => setHoveredDistrictTitle((curr) => (curr === title ? null : curr)),
      click: (event: L.LeafletMouseEvent) => {
        const pointerType = (event.originalEvent as PointerEvent | { pointerType?: string } | undefined)?.pointerType;
        if (pointerType === "touch") setHoveredDistrictTitle(null);
        onDistrictClickRef.current(title);
      },
    });
  }, []);

  return (
    <>
      <Pane name="district-background" style={{ zIndex: 300 }}>
        <Polygon positions={maskPositions} pathOptions={maskPathOptions} />
      </Pane>
      <GeoJSON
        key={geometryKey}
        data={districtGeometries}
        style={getDistrictStyle}
        onEachFeature={handleEachFeature}
        ref={geoJsonRef}
      />
    </>
  );
};
