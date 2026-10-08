import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { useState, useEffect } from "react";
import N4DLogoIcon from "../../svg/N4DLogoIcon";

const logoSizeMap = {
  [ScreenTypes.DESKTOP]: { width: "100", height: "132" },
  [ScreenTypes.TABLET]: { width: "68", height: "90" },
  [ScreenTypes.MOBILE]: { width: "68", height: "90" },
};

export function LogoN4D() {
  const screenType = useScreenType();
  const [logoWidth, setLogoWidth] = useState(logoSizeMap[screenType].width);
  const [logoHeight, setLogoHeight] = useState(logoSizeMap[screenType].height);

  useEffect(() => {
    const computedHeight = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-n4d-height",
    );

    const computedWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-n4d-width",
    );

    setLogoWidth(computedWidth);
    setLogoHeight(computedHeight);
  }, [screenType]);

  return <N4DLogoIcon width={logoWidth} height={logoHeight} />;
}

export default LogoN4D;
