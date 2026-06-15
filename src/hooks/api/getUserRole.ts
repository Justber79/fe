import { fetchFn } from "@/hooks/api/utils";
import { UserRole } from "need4deed-sdk";
import { apiPathMe } from "@/config/constants";

export interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

export const getServerUserRole = async (cookieHeader: string): Promise<UserRole | null> => {
  try {
    const urlPath = apiPathMe.replace("/api/", "");
    const response = await fetchFn<ApiResponse<{ role: UserRole }>>({
      url: `${process.env.URL_API}/${urlPath}`,
      options: {
        method: "GET",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      },
    });
    return response.data.role;
  } catch (error) {
    console.error("Failed to fetch server user role:", error);
    return null;
  }
};
