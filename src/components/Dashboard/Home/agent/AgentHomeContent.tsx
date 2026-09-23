import React from "react";
import { CreateOpportunityButton } from "./CreateOpportunityButton";
import { AgentOpportunityCards } from "./AgentOpportunityCards";

export function AgentHomeContent() {
  return (
    <>
      <CreateOpportunityButton />
      <AgentOpportunityCards />
    </>
  );
}
