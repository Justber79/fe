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
import { toast } from "react-toastify";

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
// The volunteer's name is deliberately not in the text: the BE masks it for an
// NGO that isn't linked to the volunteer yet; the home feed shows the comment's
// entity title (the volunteer, unmasked for staff) instead.
export const useRequestVolunteerSuggestion = (volunteerId: number, enabled: boolean) => {
  const { t } = useTranslation();
  const { data: coordinators, isLoading: isCoordinatorsLoading } = useStaffUsers(UserRole.COORDINATOR, enabled);
  const { data: admins, isLoading: isAdminsLoading } = useStaffUsers(UserRole.ADMIN, enabled);

  const contact = [...(coordinators ?? []), ...(admins ?? [])].find(
    (user) => user.email?.toLowerCase() === REQUEST_SUGGEST_CONTACT_EMAIL,
  );
  const contactPersonId = contact?.personId;

  const { mutate, isPending } = useMutationQuery<CreateCommentData, unknown>({
    apiPath: apiPathComment,
    method: "post",
    successMessage: "dashboard.volunteerProfile.requestSuggest.success",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });

  const requestSuggestion = (opportunityTitle: string) => {
    if (!contact || !contactPersonId) {
      toast.error(t("dashboard.volunteerProfile.requestSuggest.contactMissing"));
      return;
    }
    mutate({
      // `<@N>` holds the user id (see useCommentTag); taggedPersonIds holds person ids.
      text: `<@${contact.id}> ${REQUEST_SUGGEST_COMMENT_MARKER} ${t(
        "dashboard.volunteerProfile.requestSuggest.commentText",
        { opportunity: opportunityTitle },
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
  };
};
