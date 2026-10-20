import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { ActionButtonWithTooltip } from "@/components/Dashboard/common/ActionButtonWithTooltip";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { ActionCell, Cell, ReceivedCell, StatusBadge, TableRow } from "./styles";
import { formatDocumentDate } from "./utils";

type Props = {
  isLast: boolean;
  sentAt: Date | null;
  hasEmail: boolean;
  isSending: boolean;
  onSend: () => void;
};

export function ApplicationEmailTableRow({ isLast, sentAt, hasEmail, isSending, onSend }: Props) {
  const { t } = useTranslation();

  return (
    <TableRow $isLast={isLast}>
      <Cell>{t("dashboard.documentSection.applicationEmail.name")}</Cell>
      <ReceivedCell />
      <Cell $width="140px" $align="center">
        <StatusBadge $status={sentAt ? "uploaded" : "missing"}>
          {sentAt
            ? t("dashboard.documentSection.applicationEmail.sent")
            : t("dashboard.documentSection.applicationEmail.notSent")}
        </StatusBadge>
      </Cell>
      <Cell $width="120px" $noWrap>
        {sentAt ? formatDocumentDate(sentAt) : <EmptyPlaceholder />}
      </Cell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            hasEmail
              ? t("dashboard.documentSection.applicationEmail.send")
              : t("dashboard.documentSection.applicationEmail.noEmail")
          }
          disabled={!hasEmail || isSending}
          onClick={onSend}
          ariaLabel={t("dashboard.documentSection.applicationEmail.send")}
        >
          <PaperPlaneTilt size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell />
      <ActionCell />
      <ActionCell />
    </TableRow>
  );
}
