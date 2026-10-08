"use client";

import { ACCOUNT_READY_NOTICE, getCookie, rememberNotice } from "@/utils/helpers";
import { ApiUserVerifyEmail } from "need4deed-sdk";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const { token, lang } = useParams<{ token: string; lang: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const requested = useRef(false);

  useEffect(() => {
    setVerifying(true);
    if (!token || requested.current) return;
    requested.current = true;

    const goToLogin = () => {
      rememberNotice(ACCOUNT_READY_NOTICE);
      router.push(`/${lang}/login`);
    };

    fetch(`/api/user/verify-email`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.status === 409) {
          goToLogin();
          return;
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const { hasVolunteerProfile } = (await res.json().catch(() => ({}))) as Partial<ApiUserVerifyEmail>;
        setVerified(true);

        if (hasVolunteerProfile) {
          goToLogin();
          return;
        }
        const roleFromUrl = searchParams.get("role");
        const pendingRole = getCookie("n4d_pending_role");
        if (roleFromUrl === "agent" || pendingRole === "agent") {
          document.cookie = "n4d_pending_role=; path=/; max-age=0";
          router.push(`/${lang}/register/agent/complete?token=${encodeURIComponent(token)}`);
        } else if (roleFromUrl === "volunteer") {
          router.push(`/${lang}/register/volunteer/complete?token=${encodeURIComponent(token)}`);
        } else {
          router.push(`/${lang}/dashboard`);
        }
      })
      .catch(() => {
        setVerifying(false);
      });
  }, [token, lang, router, searchParams]);

  return (
    <div>
      <h1>Email Verification</h1>
      {verifying ? "Verifying..." : <p>{verified ? "Redirecting…" : "Verification failed. Please try again."}</p>}
    </div>
  );
}
