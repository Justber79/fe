"use client";

import { getCookie } from "@/utils/helpers";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const { token, lang } = useParams<{ token: string; lang: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setVerifying(true);
    if (!token) return;

    fetch(`/api/user/verify-email`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          setVerified(true);
          // role param in the URL is the primary signal; cookie is a fallback
          // for links opened before this change was deployed.
          const roleFromUrl = searchParams.get("role");
          const pendingRole = getCookie("n4d_pending_role");
          if (roleFromUrl === "agent" || pendingRole === "agent") {
            document.cookie = "n4d_pending_role=; path=/; max-age=0";
            // Forward the verify token — the agent form uses it as the
            // querystring auth for POST /agent/register.
            router.push(`/${lang}/register/agent/complete?token=${encodeURIComponent(token)}`);
          } else {
            router.push(`/${lang}/dashboard`);
          }
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
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
