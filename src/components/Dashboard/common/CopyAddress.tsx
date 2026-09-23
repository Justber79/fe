import { copyEmails } from "@/utils/copyEmails";
import { CopyButton } from "./CopyButton";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface CopyAddressProps {
  address: string[];
  name: string;
}

export function CopyAddress({ address, name }: CopyAddressProps) {
  const { t } = useTranslation();
  const [isCopying, setIsCopying] = useState(false);

  async function handleCopyAddress() {
    setIsCopying(true);
    try {
      await copyEmails(address);
      toast.success(t("dashboard.common.copyAddress.successSingle"));
    } catch {
      toast.error(t("dashboard.common.copyAddress.genericError"));
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <CopyButton
        onClick={handleCopyAddress}
        disabled={isCopying}
        tooltipText={t("dashboard.common.copyAddress.tooltipSingle")}
        ariaLabel={t("dashboard.common.copyAddress.copyAriaSingle", { name })}
      />
    </span>
  );
}
