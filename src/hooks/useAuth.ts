import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";
import { useEffect, useState } from "react";

export const useAuth = (contactPersonId?: Id) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  const user = useCurrentUser();

  useEffect(() => {
    const userIsAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR;
    const personId = (user as typeof user & { personId?: number })?.personId;
    if (userIsAuthorized) setIsAuthorized(true);
    if (user?.role === UserRole.VOLUNTEER && personId === contactPersonId) {
      setIsOwnProfile(true);
    } else if (user?.role === UserRole.AGENT && personId === contactPersonId) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
    return () => setIsAuthorized(false);
  }, [user, contactPersonId]);

  return { isAuthorized, isOwnProfile };
};
