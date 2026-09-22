import L from "leaflet";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";
import { LegendCard, ScrollZoomContainer } from "./styles";
import { Checkbox } from "@/components/core/button";

type Props = {
  enableScroll: boolean;
  setEnabledScroll: (prev: boolean) => void;
};

export const MapScroll = ({ enableScroll, setEnabledScroll }: Props) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const map = useMap();

  useEffect(() => {
    if (enableScroll) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [enableScroll, map]);

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
        <span>{t("dashboard.map.scrollZoom")}</span>
        <Checkbox onChange={() => setEnabledScroll(!enableScroll)} width={"25"} height={"25"} checked={enableScroll} />
      </ScrollZoomContainer>
    </LegendCard>,
    container,
  );
};
