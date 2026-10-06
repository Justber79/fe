"use client";
import { VolunteerRegistration } from "@/components/VolunteerRegistration";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/utils/QueryProvider";

const queryClient = createQueryClient();

export default function VolunteerRegistrationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <VolunteerRegistration />
    </QueryClientProvider>
  );
}
