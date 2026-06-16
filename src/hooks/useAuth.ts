import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";
import { useEffect, useState } from "react";

export const useAuth = (contactPersonId?: Id) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  const user = useCurrentUser();

  useEffect(() => {
    const userIsAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR;
    if (userIsAuthorized) setIsAuthorized(true);
    if (user?.role === UserRole.VOLUNTEER && user.id === contactPersonId) {
      setIsOwnProfile(true);
    } else if (user?.role === UserRole.AGENT && user.personId === contactPersonId) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
    return () => setIsAuthorized(false);
  }, [user, contactPersonId]);

  return { isAuthorized, isOwnProfile };
};
