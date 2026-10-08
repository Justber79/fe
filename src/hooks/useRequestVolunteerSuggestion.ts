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

type ApiUserGetWithPersonId = ApiUserGet & { personId?: number };

type CreateCommentData = {
  text: string;
  entityType: string;
  entityId: number;
  taggedPersonIds: number[];
};

const useStaffUsers = (role: UserRole, enabled: boolean) =>
  useGetQuery<ApiUserGetWithPersonId[]>({
    queryKey: ["users", role],
    apiPath: apiPathUser,
    params: { sortOrder: SortOrder.NewToOld, role, limit: MAX_PAGE_LIMIT },
    staleTime: cacheTTL,
    enabled,
  });

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
