import L from "leaflet";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";
import { LegendCard, ScrollZoomContainer } from "./styles";
import { Checkbox } from "@/components/core/button";

type Props = {
  showOtherRacs: boolean;
  setShowOtherRacs: (prev: boolean) => void;
};

export const MapOtherRacs = ({ showOtherRacs, setShowOtherRacs }: Props) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const map = useMap();

  useEffect(() => {
    const legendControl = new L.Control({ position: "topleft" });

    legendControl.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-legend-control");

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      setContainer(div);
      return div;
    };

    legendControl.addTo(map);

    return () => {
      legendControl.remove();
    };
  }, [map]);

  if (!container) return null;

  return createPortal(
    <LegendCard>
      <ScrollZoomContainer>
        <span>{t("dashboard.map.otherRacs")}</span>
        <Checkbox
          onChange={() => setShowOtherRacs(!showOtherRacs)}
          width={"25"}
          height={"25"}
          checked={showOtherRacs}
        />
      </ScrollZoomContainer>
    </LegendCard>,
    container,
  );
};
