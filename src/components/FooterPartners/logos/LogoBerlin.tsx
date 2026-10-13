import { ScreenTypes } from "@/config/constants";
import FunderLogoBerlin from "../../svg/FunderLogoBerlin";
import { useScreenType } from "@/context/DeviceContext";
import { useEffect, useState } from "react";

const logoSizeMap = {
  [ScreenTypes.DESKTOP]: { width: "170", height: "180" },
  [ScreenTypes.TABLET]: { width: "170", height: "180" },
  [ScreenTypes.MOBILE]: { width: "112", height: "120" },
};

export function LogoBerlin() {
  const screenType = useScreenType();
  const [logoWidth, setLogoWidth] = useState(logoSizeMap[screenType].width);
  const [logoHeight, setLogoHeight] = useState(logoSizeMap[screenType].height);

  useEffect(() => {
    const computedWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-berlin-width",
    );

    const computedHeight = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-berlin-height",
    );

    setLogoWidth(computedWidth);
    setLogoHeight(computedHeight);
  }, [screenType]);

  return <FunderLogoBerlin width={logoWidth} height={logoHeight} />;
}

export default LogoBerlin;
