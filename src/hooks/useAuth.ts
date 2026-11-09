import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = (compareId?: Id) => {
  const user = useCurrentUser();
  const personId = user?.personId;
  const agentId = user?.agentId;
  const isAgent = user?.role === UserRole.AGENT;
  const isVolunteer = user?.role === UserRole.VOLUNTEER;

  const isAdmin = user?.role === UserRole.ADMIN;
  const isAuthorized = isAdmin || user?.role === UserRole.COORDINATOR;
  const isOwnProfile =
    (user?.role === UserRole.VOLUNTEER && personId === compareId) || (isAgent && agentId === compareId);

  return { isAdmin, isAuthorized, isOwnProfile, isAgent, isVolunteer, isUserLoaded: Boolean(user) };
};
