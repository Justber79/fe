import { Suspense } from "react";
import BecomeVolunteer from "@/components/forms/BecomeVolunteer/BecomeVolunteer";
import { PageLayout } from "@/components/Layout/PageLayout";

export default function VolunteerPage() {
  return (
    <Suspense>
      <PageLayout>
        <BecomeVolunteer />
      </PageLayout>
    </Suspense>
  );
}
