"use client";
import { ApiVolunteerGet } from "need4deed-sdk";
import { EntityComments } from "../common";

type Props = {
  volunteer: ApiVolunteerGet;
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
