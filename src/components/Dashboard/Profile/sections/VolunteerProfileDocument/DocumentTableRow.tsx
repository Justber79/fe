import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { DownloadSimple, Eye, Trash, UploadSimple } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { ActionCell, Cell, ReceivedCell, ReceivedCheckbox, StatusBadge, TableRow } from "./styles";
import { DocumentRow } from "./utils";
import { ActionButtonWithTooltip } from "@/components/Dashboard/common/ActionButtonWithTooltip";

type Props = {
  documentRow: DocumentRow;
  isLast: boolean;
  onUpload: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onToggleReceived: () => void;
};

export function DocumentTableRow({
  documentRow,
  isLast,
  onUpload,
  onPreview,
  onDownload,
  onDelete,
  onToggleReceived,
}: Props) {
  const { t } = useTranslation();
  const { nameKey, isUploaded, isReceived, receivedAt, document } = documentRow;

  return (
    <TableRow $isLast={isLast}>
      <Cell>{t(`dashboard.documentSection.documentNames.${nameKey}`)}</Cell>
      <ReceivedCell>
        <ReceivedCheckbox
          checked={isReceived}
          onChange={onToggleReceived}
          aria-label={t("dashboard.documentSection.received")}
        />
      </ReceivedCell>
      <Cell $width="180px" $align="center">
        <StatusBadge $status={isUploaded || isReceived ? "uploaded" : "missing"}>
          {isUploaded || isReceived ? t("dashboard.documentSection.uploaded") : t("dashboard.documentSection.missing")}
        </StatusBadge>
      </Cell>
      <Cell $width="152px" $noWrap>
        {document?.createdAt ? (
          new Date(document.createdAt).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        ) : isReceived && receivedAt ? (
          receivedAt.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        ) : (
          <EmptyPlaceholder />
        )}
      </Cell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.upload")
              : t("dashboard.documentSection.tooltips.uploadUnavailable")
          }
          disabled={isUploaded}
          onClick={onUpload}
          ariaLabel="Upload document"
        >
          <UploadSimple size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.previewUnavailable")
              : t("dashboard.documentSection.tooltips.preview")
          }
          disabled={!isUploaded}
          onClick={onPreview}
          ariaLabel="View document"
        >
          <Eye size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.downloadUnavailable")
              : t("dashboard.documentSection.tooltips.download")
          }
          disabled={!isUploaded}
          onClick={onDownload}
          ariaLabel="Download document"
        >
          <DownloadSimple size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
      <ActionCell>
        <ActionButtonWithTooltip
          tooltipText={
            !isUploaded
              ? t("dashboard.documentSection.tooltips.deleteUnavailable")
              : t("dashboard.documentSection.tooltips.delete")
          }
          disabled={!isUploaded}
          onClick={onDelete}
          ariaLabel="Delete document"
        >
          <Trash size={24} weight="regular" />
        </ActionButtonWithTooltip>
      </ActionCell>
    </TableRow>
  );
}
