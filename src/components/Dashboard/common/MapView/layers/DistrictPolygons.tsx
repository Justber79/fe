import { GeoJSON, Pane, Polygon, useMap } from "react-leaflet";
import { ApiDistrictGeometryCollection } from "need4deed-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { Feature } from "geojson";
import { BERLIN_BOUNDS, districtFillColors, MAP_AREA_RING, resolveCssColor } from "../helpers";

interface Props {
  districtGeometries: ApiDistrictGeometryCollection;
  districtCounts: Map<number, number>;
  selectedDistrictIds: Set<number>;
  showCounts: boolean;
  onDistrictClick: (districtId: number) => void;
}

export const DistrictPolygons = ({
  districtGeometries,
  districtCounts,
  selectedDistrictIds,
  showCounts,
  onDistrictClick,
}: Props) => {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<number | null>(null);
  const geoJsonRef = useRef<L.GeoJSON>(null);
  const onDistrictClickRef = useRef(onDistrictClick);
  onDistrictClickRef.current = onDistrictClick;
  const districtCountsRef = useRef(districtCounts);
  districtCountsRef.current = districtCounts;
  const showCountsRef = useRef(showCounts);
  showCountsRef.current = showCounts;
  const hasInitializedMapView = useRef(false);
  const map = useMap();
  const selectedDistrictId = selectedDistrictIds.size === 1 ? Array.from(selectedDistrictIds)[0] : undefined;

  const { inactiveColor, resolvedColors, maskPathOptions } = useMemo(() => {
    const inactive = resolveCssColor("var(--color-black)");
    const colors = Object.fromEntries(
      Object.entries(districtFillColors).map(([title, color]) => [title, resolveCssColor(color)]),
    );
    return {
      inactiveColor: inactive,
      resolvedColors: colors,
      maskPathOptions: { fillColor: inactive, fillOpacity: 0.35, stroke: false },
    };
  }, []);

  const geometryKey = useMemo(
    () => districtGeometries.features.map(({ properties }) => properties.districtId).join("|"),
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
      const districtId = feature?.properties?.districtId as number | undefined;
      const title = feature?.properties?.title as string | undefined;
      const count = districtId ? (districtCounts.get(districtId) ?? 0) : 0;
      const isSelected = districtId !== undefined && selectedDistrictIds.has(districtId);
      const isHovered = districtId === hoveredDistrictId;
      const isInactive = count === 0 || (selectedDistrictIds.size > 0 && !isSelected);

      return {
        fillColor: isInactive ? inactiveColor : (title && resolvedColors[title]) || resolvedColors.Mitte,
        fillOpacity: isInactive ? 0.35 : 0.2,
        color: inactiveColor,
        weight: isSelected || isHovered ? 2.5 : 1.5,
      };
    },
    [districtCounts, hoveredDistrictId, inactiveColor, resolvedColors, selectedDistrictIds],
  );

  useEffect(() => {
    geoJsonRef.current?.eachLayer((layer) => {
      const feature = (layer as L.Layer & { feature?: Feature }).feature;
      const districtId = feature?.properties?.districtId as number | undefined;
      const title = feature?.properties?.title as string | undefined;
      layer.unbindTooltip();
      if (typeof title !== "string" || !title || districtId === undefined) return;

      const path = (layer as L.Path).getElement() as SVGPathElement | undefined;
      if (path) {
        path.setAttribute("aria-label", showCounts ? `${title}: ${districtCounts.get(districtId) ?? 0}` : title);
      }

      const label = L.DomUtil.create("span");
      const count = districtCounts.get(districtId) ?? 0;
      label.textContent = showCounts ? String(count) : title;
      label.setAttribute("aria-label", `${title}: ${label.textContent}`);
      layer.bindTooltip(label, {
        permanent: showCounts,
        direction: "center",
        className: "district-count-tooltip",
        interactive: false,
      });
      if (showCounts) layer.openTooltip();
    });
  }, [districtCounts, geometryKey, showCounts]);

  const handleEachFeature = useCallback((feature: Feature, layer: L.Layer) => {
    const title = feature.properties?.title;
    const districtId = feature.properties?.districtId as number | undefined;
    if (!title || districtId === undefined) return;

    const showDistrictTitle = () => {
      const label = L.DomUtil.create("span");
      label.textContent = title;
      layer.setTooltipContent(label);
      layer.openTooltip();
    };
    const showDistrictCount = () => {
      const label = L.DomUtil.create("span");
      label.textContent = String(districtCountsRef.current.get(districtId) ?? 0);
      layer.setTooltipContent(label);
      if (showCountsRef.current) layer.openTooltip();
      else layer.closeTooltip();
    };

    layer.on({
      mouseover: () => {
        setHoveredDistrictId(districtId);
        showDistrictTitle();
      },
      mouseout: () => {
        setHoveredDistrictId((curr) => (curr === districtId ? null : curr));
        showDistrictCount();
      },
      click: (event: L.LeafletMouseEvent) => {
        const pointerType = (event.originalEvent as PointerEvent | { pointerType?: string } | undefined)?.pointerType;
        if (pointerType === "touch") setHoveredDistrictId(null);
        layer.closeTooltip();
        onDistrictClickRef.current(districtId);
      },
      add: () => {
        const path = (layer as L.Path).getElement() as SVGPathElement | undefined;
        if (!path) return;
        path.setAttribute("tabindex", "0");
        path.setAttribute("role", "button");
        path.setAttribute("aria-label", `${title}: ${districtCountsRef.current.get(districtId) ?? 0}`);
        path.style.cursor = "pointer";
        const handleKeyDown = (event: Event) => {
          const keyEvent = event as KeyboardEvent;
          if (keyEvent.key !== "Enter" && keyEvent.key !== " ") return;
          keyEvent.preventDefault();
          layer.closeTooltip();
          onDistrictClickRef.current(districtId);
        };
        const handleFocus = () => {
          setHoveredDistrictId(districtId);
          showDistrictTitle();
        };
        const handleBlur = () => {
          setHoveredDistrictId((current) => (current === districtId ? null : current));
          showDistrictCount();
        };
        path.addEventListener("keydown", handleKeyDown);
        path.addEventListener("focus", handleFocus);
        path.addEventListener("blur", handleBlur);
        layer.once("remove", () => {
          path.removeEventListener("keydown", handleKeyDown);
          path.removeEventListener("focus", handleFocus);
          path.removeEventListener("blur", handleBlur);
        });
      },
    });
  }, []);

  useEffect(() => {
    if (hasInitializedMapView.current) {
      if (selectedDistrictId === undefined) return;
      const selectedFeature = districtGeometries.features.find(
        ({ properties }) => properties.districtId === selectedDistrictId,
      );
      if (!selectedFeature) return;
      const selectedBounds = L.geoJSON(selectedFeature).getBounds();
      if (selectedBounds.isValid()) map.panTo(selectedBounds.getCenter());
      return;
    }

    hasInitializedMapView.current = true;
    if (selectedDistrictId === undefined) {
      map.fitBounds(BERLIN_BOUNDS, { padding: [12, 12], maxZoom: 9 });
      return;
    }

    const feature = districtGeometries.features.find(({ properties }) => properties.districtId === selectedDistrictId);
    if (!feature) return;
    const bounds = L.geoJSON(feature).getBounds();
    if (bounds.isValid()) map.setView(bounds.getCenter(), map.getZoom());
  }, [districtGeometries, map, selectedDistrictId]);

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
