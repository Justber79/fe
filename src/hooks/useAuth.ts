import { Id, UserRole } from "need4deed-sdk";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = (compareId?: Id) => {
  const user = useCurrentUser();
  const personId = user?.personId;
  const agentId = user?.agentId;

  const isAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR;
  const isOwnProfile =
    (user?.role === UserRole.VOLUNTEER && personId === compareId) ||
    (user?.role === UserRole.AGENT && agentId === compareId);

  return { isAuthorized, isOwnProfile };
};
