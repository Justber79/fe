"use client";
import { AgentRegistration } from "@/components/AgentRegistration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AgentRegistrationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentRegistration />
    </QueryClientProvider>
  );
}
