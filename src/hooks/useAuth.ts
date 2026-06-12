import { UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const user = useCurrentUser();

  useEffect(() => {
    const userIsAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR;
    if (userIsAuthorized) setIsAuthorized(true);
  }, [user]);

  return isAuthorized;
};
