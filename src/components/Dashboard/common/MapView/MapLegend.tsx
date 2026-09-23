import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { DEFAULT_LEAFLET_ICON_URL, defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { LegendCard, LegendTitle, LegendRow, IconSlot } from "./styles";
import { useTranslation } from "react-i18next";

export function MapLegendControl() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const map = useMap();

  useEffect(() => {
    const legendControl = new L.Control({ position: "topright" });

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
      <LegendTitle>{t("dashboard.map.legend.title")}</LegendTitle>

      <LegendRow>
        <IconSlot>
          <img src={DEFAULT_LEAFLET_ICON_URL} alt={`${t("dashboard.map.legend.rac")} Pin`} />
        </IconSlot>
        <span>{t("dashboard.map.legend.rac")}</span>
      </LegendRow>

      <LegendRow>
        <IconSlot>
          <img
            src={DEFAULT_LEAFLET_ICON_URL}
            className="ngo-pin"
            alt={`${t("dashboard.map.legend.opportunity")} Pin`}
          />
        </IconSlot>
        <span>{t("dashboard.map.legend.opportunity")}</span>
      </LegendRow>

      <LegendRow>
        <IconSlot>
          <img
            src={getImageUrl(defaultAvatarURL)}
            className="custom-icon"
            alt={`${t("dashboard.map.legend.volunteer")} Pin`}
          />
        </IconSlot>
        <span>{t("dashboard.map.legend.volunteer")}</span>
      </LegendRow>
    </LegendCard>,
    container,
  );
}
