import { useRouter } from "next/navigation";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordController() {
  const router = useRouter();

  return <ResetPasswordForm onResetSuccess={() => router.push("/login")} />;
}
