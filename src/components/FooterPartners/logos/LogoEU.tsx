import { useScreenType } from "@/context/DeviceContext";
import FunderLogoEU from "../../svg/FunderLogoEU";
import { useEffect, useState } from "react";
import { ScreenTypes } from "@/config/constants";

const logoSizeMap = {
  [ScreenTypes.DESKTOP]: { width: "194", height: "180" },
  [ScreenTypes.TABLET]: { width: "194", height: "180" },
  [ScreenTypes.MOBILE]: { width: "130", height: "120" },
};

export function LogoEU() {
  const screenType = useScreenType();
  const [logoWidth, setLogoWidth] = useState(logoSizeMap[screenType].width);
  const [logoHeight, setLogoHeight] = useState(logoSizeMap[screenType].height);

  useEffect(() => {
    const computedHeight = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-eu-height",
    );

    const computedWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-eu-width",
    );

    setLogoWidth(computedWidth);
    setLogoHeight(computedHeight);
  }, [screenType]);

  return <FunderLogoEU width={logoWidth} height={logoHeight} />;
}

export default LogoEU;
