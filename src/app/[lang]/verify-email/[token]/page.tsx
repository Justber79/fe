"use client";

import { getCookie } from "@/utils/helpers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const { token, lang } = useParams<{ token: string; lang: string }>();
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
          const pendingRole = getCookie("n4d_pending_role");
          if (pendingRole === "agent") {
            document.cookie = "n4d_pending_role=; path=/; max-age=0";
            router.push(`/${lang}/register/agent/complete`);
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
  }, [token, lang, router]);

  return (
    <div>
      <h1>Email Verification</h1>
      {verifying ? "Verifying..." : <p>{verified ? "Redirecting…" : "Verification failed. Please try again."}</p>}
    </div>
  );
}
