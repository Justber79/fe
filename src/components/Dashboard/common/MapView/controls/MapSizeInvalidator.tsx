import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapSizeInvalidator = () => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let animationFrame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [map]);

  return null;
};
