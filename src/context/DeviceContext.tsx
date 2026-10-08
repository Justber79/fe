"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { screenSizeThresholds, ScreenTypes } from "@/config/constants";

const getClientScreenType = (): ScreenTypes => {
  if (window.innerWidth < screenSizeThresholds.tablet) return ScreenTypes.MOBILE;
  if (window.innerWidth < screenSizeThresholds.desktop) return ScreenTypes.TABLET;
  return ScreenTypes.DESKTOP;
};

interface DeviceContextType {
  screenType: ScreenTypes;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
  initialScreenType: ScreenTypes;
}

export function DeviceProvider({ children, initialScreenType }: DeviceProviderProps) {
  const [screenType, setScreenType] = useState<ScreenTypes>(initialScreenType);

  useEffect(() => {
    const handleResize = () => {
      setScreenType(getClientScreenType());
    };

    window.addEventListener("resize", handleResize);

    setScreenType(getClientScreenType());

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <DeviceContext.Provider value={{ screenType }}>{children}</DeviceContext.Provider>;
}

export function useScreenType() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useScreenType must be used within a DeviceProvider");
  }

  return context.screenType;
}
