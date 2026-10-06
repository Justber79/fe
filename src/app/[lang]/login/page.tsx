"use client";
import { Login } from "@/components/Login";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/utils/QueryProvider";

const queryClient = createQueryClient();

export default function LoginPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}
