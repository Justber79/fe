import { useCallback, useEffect, useRef, useState } from "react";

export const useFadedNavigation = <T>(triggerId?: T, duration = 300) => {
  const [isFading, setIsFading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const navigateWithFade = useCallback(
    (action: () => void) => {
      setIsFading((prevIsFading) => {
        if (prevIsFading) return true;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(action, duration);

        return true;
      });
    },
    [duration],
  );

  useEffect(() => {
    setIsFading(false);
  }, [triggerId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isFading, navigateWithFade };
};
