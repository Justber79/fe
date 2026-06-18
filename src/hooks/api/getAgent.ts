import { fetchFn } from "@/hooks/api/utils";
import { apiPathAgent } from "@/config/constants";
import { ApiAgentGet } from "need4deed-sdk";

export interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

const apiEndpoint = process.env.NODE_ENV === "development" ? "/agent" : apiPathAgent;

export const getServerAgent = async (cookieHeader: string, id: string | number): Promise<ApiAgentGet | null> => {
  try {
    const response = await fetchFn<ApiResponse<ApiAgentGet>>({
      url: `${process.env.URL_API}${apiEndpoint}/${id}`,
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
