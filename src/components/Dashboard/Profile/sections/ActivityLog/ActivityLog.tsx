import {
  ActionButton,
  ActionCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/core/common/Table";
import { useActivityLog } from "@/hooks/useActivityLog";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { ApiActivityLogEntry, ApiActivityLogPost } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "../shared/ConfirmationDialog";
import { SectionEmptyState, SectionWrapper } from "../shared/styles";
import { formatDate } from "../shared/utils/formatDate";
import { ActivityLogDialog } from "./ActivityLogDialog";
import { ActivityLogTableContainer, AddEntryButton, AddEntryRow, TotalCell, TotalRow, TotalSpacer } from "./styles";
import { ActivityLogFormData } from "./types";
import { formatHours } from "./utils";

type Props = {
  opportunityVolunteerId: number;
  readOnly?: boolean;
};

export function ActivityLog({ opportunityVolunteerId, readOnly = false }: Props) {
  const { t } = useTranslation();
  const { entries, totalHours, isLoading, createEntry, isCreating, updateEntry, isUpdating, deleteEntry, isDeleting } =
    useActivityLog(opportunityVolunteerId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ApiActivityLogEntry | undefined>(undefined);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<ApiActivityLogEntry | null>(null);

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: ApiActivityLogEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleSave = (data: ActivityLogFormData) => {
    const payload: ApiActivityLogPost = { date: data.date, hours: data.hours };
    if (editingEntry) {
      updateEntry({ id: editingEntry.id, data: payload }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createEntry(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (isDeleting) return;
    if (deleteConfirmEntry) {
      deleteEntry(deleteConfirmEntry.id, {
        onSuccess: () => setDeleteConfirmEntry(null),
        onError: () => setDeleteConfirmEntry(null),
      });
    }
  };

  return (
    <SectionWrapper data-testid="activity-log-container">
      {!isLoading && entries.length === 0 ? (
        <SectionEmptyState data-testid="activity-log-empty-state">
          {t("dashboard.activityLog.emptyState")}
        </SectionEmptyState>
      ) : (
        <ActivityLogTableContainer data-testid="activity-log-table">
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.activityLog.date")}</TableHeaderCell>
              <TableHeaderCell>{t("dashboard.activityLog.hours")}</TableHeaderCell>
              {!readOnly && (
                <>
                  <TableHeaderCell $width="var(--communication-tracker-action-column-width)" />
                  <TableHeaderCell $width="var(--communication-tracker-action-column-width)" />
                </>
              )}
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  $isLast={index === entries.length - 1}
                  data-testid={`activity-log-row-${entry.id}`}
                >
                  <TableCell $noWrap>{formatDate(entry.date)}</TableCell>
                  <TableCell>{formatHours(Number(entry.hours))}</TableCell>
                  {!readOnly && (
                    <>
                      <ActionCell>
                        <ActionButton
                          type="button"
                          onClick={() => handleEdit(entry)}
                          aria-label={t("dashboard.activityLog.editEntry")}
                          data-testid={`edit-button-${entry.id}`}
                        >
                          <PencilSimple size={20} weight="regular" />
                        </ActionButton>
                      </ActionCell>
                      <ActionCell>
                        <ActionButton
                          type="button"
                          onClick={() => setDeleteConfirmEntry(entry)}
                          aria-label={t("dashboard.activityLog.deleteEntry")}
                          data-testid={`delete-button-${entry.id}`}
                        >
                          <Trash size={20} weight="regular" />
                        </ActionButton>
                      </ActionCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TotalRow data-testid="activity-log-total">
            <TotalCell>{t("dashboard.activityLog.total")}</TotalCell>
            <TotalCell>{t("dashboard.activityLog.hoursValue", { hours: formatHours(totalHours) })}</TotalCell>
            {!readOnly && (
              <>
                <TotalSpacer />
                <TotalSpacer />
              </>
            )}
          </TotalRow>
        </ActivityLogTableContainer>
      )}

      {!readOnly && (
        <AddEntryRow>
          <AddEntryButton type="button" onClick={handleAddNew} data-testid="activity-log-add-button">
            <Plus size={20} weight="bold" />
            {t("dashboard.activityLog.addEntry")}
          </AddEntryButton>
        </AddEntryRow>
      )}

      {isDialogOpen && (
        <ActivityLogDialog
          isOpen
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          initialData={editingEntry}
          isSaving={isCreating || isUpdating}
        />
      )}

      {deleteConfirmEntry && (
        <ConfirmationDialog
          title={t("dashboard.activityLog.deleteConfirmTitle")}
          message={t("dashboard.activityLog.deleteConfirmText", {
            date: formatDate(deleteConfirmEntry.date),
          })}
          onCancel={() => setDeleteConfirmEntry(null)}
          onConfirm={confirmDelete}
        />
      )}
    </SectionWrapper>
  );
}
