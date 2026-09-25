import { Suspense } from "react";
import { OpportunityCards } from "@/components/Website/OpportunityCards";

export default function OpportunityCardsPage() {
  return (
    <Suspense>
      <OpportunityCards />
    </Suspense>
  );
}
