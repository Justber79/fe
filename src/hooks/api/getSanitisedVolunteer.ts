import { apiPathVolunteer } from "@/config/constants";
import { ApiResponse, ApiSecuredVolunteerGet } from "./types";
import { fetchFn } from "./utils";
import { getServerUserRole } from "./getUserRole";
import { UserRole } from "need4deed-sdk";

export const getSanitisedVolunteerProfile = async (
  entityId: string,
  cookieHeader: string,
): Promise<ApiResponse<ApiSecuredVolunteerGet> | null> => {
  try {
    const urlPath = apiPathVolunteer.replace("/api/", "");
    const response = await fetchFn<ApiResponse<ApiSecuredVolunteerGet>>({
      url: `${process.env.URL_API}/${urlPath}/${entityId}`,
      options: {
        method: "GET",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      },
    });

    let volunteer = response.data;
    const userRole = await getServerUserRole(cookieHeader);

    if (!volunteer || !userRole) return null;

    if (userRole === UserRole.AGENT) {
      volunteer = {
        ...volunteer,
        person: {
          id: 0,
          firstName: volunteer.person.firstName,
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          landline: "",
          avatarUrl: volunteer.person.avatarUrl,
        },
        comments: [],
      };
    }

    return {
      message: "Success",
      data: volunteer,
      count: 1,
    };
  } catch (error) {
    console.error(`Failed to fetch volunteer ${entityId} on server:`, error);
    return null;
  }
};
