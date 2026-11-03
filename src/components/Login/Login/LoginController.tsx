import { useCurrentUser } from "@/hooks/useCurrentUser";
import i18next from "i18next";
import { UserRole } from "need4deed-sdk";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoginForm } from "./LoginForm";
import { consumeSessionExpired } from "@/utils/apiErrors";
import { ACCOUNT_READY_NOTICE, consumeNotice, setAuthHint } from "@/utils/helpers";

export function LoginController() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { lang: language } = useParams<{ lang: string }>();

  useEffect(() => {
    if (consumeSessionExpired()) toast.error(i18next.t("message.sessionExpired"), { toastId: "session-expired" });
    if (consumeNotice(ACCOUNT_READY_NOTICE))
      toast.success(i18next.t("message.accountReady"), { toastId: "account-ready" });
  }, []);

  const user = useCurrentUser(isLoggedIn);
  useEffect(() => {
    if (!(user && "role" in user)) return;
    const path =
      user.role !== UserRole.USER ? `/${language}/dashboard?role=${user.role}&userId=${user.id}` : `/${language}`;
    router.push(path);
  }, [user, language, router]);

  return (
    <LoginForm
      lang={language}
      onLoginSuccess={() => {
        setAuthHint();
        setIsLoggedIn(true);
      }}
    />
  );
}
