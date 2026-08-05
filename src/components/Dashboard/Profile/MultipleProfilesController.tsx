import React, { useCallback, useState } from "react";
import ProfileLayout from "./ProfileLayout";
import { ProfileNavigationDirection } from "./types";

type Props = {
  agentIds: Array<number>;
};

export const MultipleProfilesController = ({ agentIds }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleProfileNavigation = useCallback(
    (direction: ProfileNavigationDirection): void => {
      if (direction === ProfileNavigationDirection.LEFT) {
        return currentIndex !== 0 ? setCurrentIndex((n) => n - 1) : setCurrentIndex(agentIds.length - 1);
      } else if (direction === ProfileNavigationDirection.RIGHT) {
        return currentIndex !== agentIds.length - 1 ? setCurrentIndex((n) => n + 1) : setCurrentIndex(0);
      }
      return;
    },
    [currentIndex],
  );
  return (
    <ProfileLayout
      entityId={String(agentIds[currentIndex])}
      entityType={"agent"}
      handleProfileNavigation={handleProfileNavigation}
    />
  );
};
