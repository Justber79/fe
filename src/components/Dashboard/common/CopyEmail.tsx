import { copyEmails } from "@/utils/copyEmails";
import { CopyButton } from "./CopyButton";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface CopyEmailProps {
  email: string;
  name: string;
}

export function CopyEmail({ email, name }: CopyEmailProps) {
  const { t } = useTranslation();
  const [isCopying, setIsCopying] = useState(false);

  async function handleCopyEmail() {
    setIsCopying(true);
    try {
      await copyEmails([email]);
      toast.success(t("dashboard.volunteers.copyEmails.successSingle"));
    } catch {
      toast.error(t("dashboard.volunteers.copyEmails.genericError"));
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <CopyButton
        onClick={handleCopyEmail}
        disabled={isCopying}
        tooltipText={t("dashboard.volunteers.copyEmails.tooltipSingle")}
        ariaLabel={t("dashboard.volunteers.copyEmails.copyAriaSingle", { name })}
      />
    </span>
  );
}
