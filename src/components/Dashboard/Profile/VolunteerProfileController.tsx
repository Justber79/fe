import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import ProfilePage from "./ProfilePage";
import { ApiVolunteerGet } from "need4deed-sdk";

type Props = {
  entityId: string;
};

export const VolunteerProfileController = ({ entityId }: Props) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", entityId],
    apiPath: `${apiPathVolunteer}/${entityId}`,
    staleTime: cacheTTL,
  });
  return (
    <LoadingErrorWrapper isLoading={isLoading} isError={isError} error={error} data={data} entityType="volunteer">
      {data && <ProfilePage volunteer={data} />}
    </LoadingErrorWrapper>
  );
};
