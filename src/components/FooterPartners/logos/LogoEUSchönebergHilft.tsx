import { ScreenTypes } from "@/config/constants";
import FunderLogoSchönebergHilft from "../../svg/FunderLogoSchönebergHilft";
import { useEffect, useState } from "react";
import { useScreenType } from "@/context/DeviceContext";

const logoSizeMap = {
  [ScreenTypes.DESKTOP]: { width: "150", height: "150" },
  [ScreenTypes.TABLET]: { width: "150", height: "150" },
  [ScreenTypes.MOBILE]: { width: "100", height: "100" },
};

export function LogoSchönebergHilft() {
  const screenType = useScreenType();
  const [logoWidth, setLogoWidth] = useState(logoSizeMap[screenType].width);
  const [logoHeight, setLogoHeight] = useState(logoSizeMap[screenType].height);

  useEffect(() => {
    const computedHeight = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-SchönebergHilft-height",
    );

    const computedWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-SchönebergHilft-width",
    );

    setLogoWidth(computedWidth);
    setLogoHeight(computedHeight);
  }, [screenType]);

  return <FunderLogoSchönebergHilft width={logoWidth} height={logoHeight} />;
}

export default LogoSchönebergHilft;
