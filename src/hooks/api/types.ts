import { ApiVolunteerGet } from "need4deed-sdk";

export interface ApiResponse<T> {
  message: string;
  data: T;
  count: number;
}

export type ApiSecuredVolunteerGet =
  | ApiVolunteerGet
  | (Omit<ApiVolunteerGet, "person" | "comments"> & {
      person: {
        id: number;
        firstName: string;
        middleName: string;
        lastName: string;
        email: string;
        phone: string;
        address: "";
        landline: "";
        avatarUrl: string;
      };
      comments: never[];
    });
