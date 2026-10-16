import { minAppointmentDay } from "need4deed-sdk";
import { useMemo } from "react";
import { useAuth } from "./useAuth";

export const useMinAppointmentDate = (): Date | undefined => {
  const { isAuthorized } = useAuth();
  return useMemo(() => (isAuthorized ? undefined : minAppointmentDay()), [isAuthorized]);
};
