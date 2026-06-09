import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import ProfilePage from "./ProfilePage";
import { ApiResponse, ApiSecuredVolunteerGet } from "@/hooks/api/types";

type Props = {
  entityId: string;
  secureData?: ApiResponse<ApiSecuredVolunteerGet>;
};

export const VolunteerProfileController = ({ entityId, secureData }: Props) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiSecuredVolunteerGet>({
    queryKey: ["volunteer", entityId],
    apiPath: `${apiPathVolunteer}/${entityId}`,
    staleTime: cacheTTL,
    initialData: secureData,
  });
  return (
    <LoadingErrorWrapper isLoading={isLoading} isError={isError} error={error} data={data} entityType="volunteer">
      {data && <ProfilePage volunteer={data} />}
    </LoadingErrorWrapper>
  );
};
