import {
  apiPathComment,
  apiPathUser,
  cacheTTL,
  MAX_PAGE_LIMIT,
  REQUEST_SUGGEST_COMMENT_MARKER,
  REQUEST_SUGGEST_CONTACT_EMAIL,
} from "@/config/constants";
import { useGetQuery, useMutationQuery } from "@/hooks";
import { ApiUserGet, SortOrder, UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

// personId is not yet in ApiUserGet SDK type — cast until SDK is updated
type ApiUserGetWithPersonId = ApiUserGet & { personId?: number };

type CreateCommentData = {
  text: string;
  entityType: string;
  entityId: number;
  taggedPersonIds: number[];
};

// Same query keys/params as useCommentTag, so the staff lists share a cache.
const useStaffUsers = (role: UserRole, enabled: boolean) =>
  useGetQuery<ApiUserGetWithPersonId[]>({
    queryKey: ["users", role],
    apiPath: apiPathUser,
    params: { sortOrder: SortOrder.NewToOld, role, limit: MAX_PAGE_LIMIT },
    staleTime: cacheTTL,
    enabled,
  });

// NGO "request to suggest" (fe#1092): a comment on the volunteer that tags the
// contact@need4deed.org account, so it lands in their home-screen tag feed.
export const useRequestVolunteerSuggestion = (volunteerId: number, volunteerName: string, enabled: boolean) => {
  const { t } = useTranslation();
  const { data: coordinators, isLoading: isCoordinatorsLoading } = useStaffUsers(UserRole.COORDINATOR, enabled);
  const { data: admins, isLoading: isAdminsLoading } = useStaffUsers(UserRole.ADMIN, enabled);

  const contactPersonId = [...(coordinators ?? []), ...(admins ?? [])].find(
    (user) => user.email?.toLowerCase() === REQUEST_SUGGEST_CONTACT_EMAIL,
  )?.personId;

  const { mutate, isPending } = useMutationQuery<CreateCommentData, unknown>({
    apiPath: apiPathComment,
    method: "post",
    successMessage: "dashboard.volunteerProfile.requestSuggest.success",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });

  const requestSuggestion = (opportunityTitle: string) => {
    if (!contactPersonId) return;
    mutate({
      text: `<@${contactPersonId}> ${REQUEST_SUGGEST_COMMENT_MARKER} ${t(
        "dashboard.volunteerProfile.requestSuggest.commentText",
        { volunteer: volunteerName, opportunity: opportunityTitle },
      )}`,
      entityType: "volunteer",
      entityId: volunteerId,
      taggedPersonIds: [contactPersonId],
    });
  };

  return {
    requestSuggestion,
    isPending,
    isContactLoading: isCoordinatorsLoading || isAdminsLoading,
    hasContact: !!contactPersonId,
  };
};
