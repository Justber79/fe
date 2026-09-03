import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = (compareId?: Id) => {
  const user = useCurrentUser();
  const personId = user?.personId;
  const agentId = user?.agentId;
  const isAgent = user?.role === UserRole.AGENT;

  const isAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR;
  const isOwnProfile =
    (user?.role === UserRole.VOLUNTEER && personId === compareId) || (isAgent && agentId === compareId);

  return { isAuthorized, isOwnProfile, isAgent };
};
