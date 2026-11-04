import { useParams, useRouter } from "next/navigation";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordController() {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();

  return <ResetPasswordForm onResetSuccess={() => router.push(`/${lang}/login`)} />;
}
