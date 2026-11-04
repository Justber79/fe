import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapPopupControlVisibility = () => {
  const map = useMap();

  useEffect(() => {
    const mapContainer = map.getContainer();
    const handlePopupOpen = () => mapContainer.classList.add("map-popup-open");
    const handlePopupClose = () => mapContainer.classList.remove("map-popup-open");

    map.on("popupopen", handlePopupOpen);
    map.on("popupclose", handlePopupClose);

    return () => {
      map.off("popupopen", handlePopupOpen);
      map.off("popupclose", handlePopupClose);
      handlePopupClose();
    };
  }, [map]);

  return null;
};
