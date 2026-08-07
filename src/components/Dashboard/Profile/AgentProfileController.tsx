import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import ProfilePage from "./ProfilePage";
import { ApiAgentProfileGet, ProfileNavigationDirection } from "./types";

type Props = {
  entityId: string;
  handleProfileNavigation?: (direction: ProfileNavigationDirection) => void;
};

export const AgentProfileController = ({ entityId, handleProfileNavigation }: Props) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiAgentProfileGet>({
    queryKey: ["agent", entityId],
    apiPath: `${apiPathAgent}/${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper isLoading={isLoading} isError={isError} error={error} data={data} entityType="agent">
      {data && <ProfilePage agent={data} handleProfileNavigation={handleProfileNavigation} />}
    </LoadingErrorWrapper>
  );
};
