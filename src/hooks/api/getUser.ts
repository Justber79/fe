import { fetchFn } from "@/hooks/api/utils";
import { apiPathMe } from "@/config/constants";
import { ApiUserGet } from "need4deed-sdk";

export interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

const apiEndpoint = process.env.NODE_ENV === "development" ? "/user/me" : apiPathMe;

export const getServerUser = async (cookieHeader: string): Promise<ApiUserGet | null> => {
  try {
    const response = await fetchFn<ApiResponse<ApiUserGet>>({
      url: `${process.env.URL_API}${apiEndpoint}`,
      options: {
        method: "GET",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch server user role:", error);
    return null;
  }
};
