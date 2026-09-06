import axios from "axios";
import { apiPathVolunteerRegister } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerGet, ApiVolunteerRegisterNew } from "need4deed-sdk";

type Props = {
  token: string | null;
  onSuccess?: () => void;
};

export const useRegisterVolunteer = ({ token, onSuccess }: Props) => {
  return useMutationQuery<ApiVolunteerRegisterNew, { message: string; data: ApiVolunteerGet }>({
    mutationFn: async (payload: ApiVolunteerRegisterNew) => {
      if (!token) {
        throw new Error("Token is required for volunteer registration");
      }
      const response = await axios.post<{ message: string; data: ApiVolunteerGet }>(
        `${apiPathVolunteerRegister}?token=${encodeURIComponent(token)}`,
        payload,
      );
      return response.data;
    },
    onSuccessCallback: onSuccess,
    successMessage: "volunteerRegistration.success.title",
    queryKeyToInvalidate: ["volunteer"],
  });
};
