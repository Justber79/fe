import { Suspense } from "react";
import BecomeVolunteer from "@/components/forms/BecomeVolunteer/BecomeVolunteer";

export default function VolunteerPage() {
  return (
    <Suspense>
      <BecomeVolunteer />
    </Suspense>
  );
}
