"use client";
import { EntityComments } from "../common";
import { ApiSecuredVolunteerGet } from "@/hooks/api/types";

type Props = {
  volunteer: ApiSecuredVolunteerGet;
};

export function VolunteerComments({ volunteer }: Props) {
  return (
    <EntityComments
      entityId={volunteer.id}
      entityType="volunteer"
      comments={volunteer.comments ?? []}
      testId="volunteer-comments-container"
    />
  );
}
