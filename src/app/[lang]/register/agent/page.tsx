"use client";
import { AgentRegistration } from "@/components/AgentRegistration";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/utils/QueryProvider";

const queryClient = createQueryClient();

export default function AgentRegistrationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentRegistration />
    </QueryClientProvider>
  );
}
