"use client";
import { VolunteerRegistration } from "@/components/VolunteerRegistration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function VolunteerRegistrationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <VolunteerRegistration />
    </QueryClientProvider>
  );
}
