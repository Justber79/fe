import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { useAppreciationTracker } from "@/hooks/useAppreciationTracker";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import {
  ApiVolunteerGet,
  ApiAppreciationPost,
  VolunteerStateAppreciationType,
  ApiAppreciationPatch,
  ApiAppreciationGet,
  AppreciationStatusType,
} from "need4deed-sdk";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppreciationDialog } from "./AppreciationDialog";
import { ConfirmationDialog } from "../shared/ConfirmationDialog";
import { SectionWrapper, SectionEmptyState } from "../shared/styles";
import { AppreciationTableContainer, StatusBadge } from "./styles";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  ActionCell,
  ActionButton,
} from "@/components/core/common/Table";
import { formatDate } from "../shared/utils/formatDate";
import { getAppreciationTypeLabel } from "./utils/translations";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { createAppreciationStatusLabelMap } from "./constants";

type Props = {
  volunteer: ApiVolunteerGet;
};

export type AppreciationRef = {
  handleAddNew: () => void;
};

export const Appreciation = forwardRef<AppreciationRef, Props>(function Appreciation({ volunteer }, ref) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ApiAppreciationGet | undefined>(undefined);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<ApiAppreciationGet | null>(null);

  const { appreciations, createAppreciation, updateAppreciation, deleteAppreciation } = useAppreciationTracker(
    volunteer.id,
  );

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleAddNew,
  }));

  const handleEdit = (entry: ApiAppreciationGet) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: ApiAppreciationGet) => {
    setDeleteConfirmEntry(entry);
  };

  const confirmDelete = () => {
    if (deleteConfirmEntry) {
      deleteAppreciation(deleteConfirmEntry.id, {
        onSuccess: () => setDeleteConfirmEntry(null),
        onError: () => setDeleteConfirmEntry(null),
      });
    }
  };

  const handleSave = (data: {
    id?: number;
    title: VolunteerStateAppreciationType;
    dateDue: Date | null;
    dateDelivery: Date | null;
    status: AppreciationStatusType;
  }) => {
    if (data.id) {
      const payload: ApiAppreciationPatch = {
        title: data.title,
        dateDue: data.dateDue,
        dateDelivery: data.dateDelivery,
        status: data.status,
      };
      updateAppreciation({ id: data.id, data: payload }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      const payload: ApiAppreciationPost = {
        title: data.title,
        dateDue: data.dateDue,
        dateDelivery: data.dateDelivery ?? undefined,
        status: data.status,
      };
      createAppreciation(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const statusLabels = useMemo(() => createAppreciationStatusLabelMap(t), [t]);
  const getStatusLabel = (entry: ApiAppreciationGet) => statusLabels[entry.status] ?? EMPTY_PLACEHOLDER_VALUE;

  return (
    <SectionWrapper data-testid="appreciation-container">
      {appreciations.length === 0 ? (
        <SectionEmptyState data-testid="empty-state">{t("dashboard.appreciationSection.emptyState")}</SectionEmptyState>
      ) : (
        <AppreciationTableContainer data-testid="appreciations-table">
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.appreciationSection.typeOfAppreciation")}</TableHeaderCell>
              <TableHeaderCell $width="227px">{t("dashboard.appreciationSection.status")}</TableHeaderCell>
              <TableHeaderCell $width="146px">{t("dashboard.appreciationSection.statusDueTo")}</TableHeaderCell>
              <TableHeaderCell $width="146px">{t("dashboard.appreciationSection.statusMailedOn")}</TableHeaderCell>
              <TableHeaderCell $width="146px">{t("dashboard.appreciationSection.receivedOn")}</TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)" />
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)" />
            </TableHeader>
            <TableBody>
              {appreciations.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  $isLast={index === appreciations.length - 1}
                  data-testid={`appreciation-row-${entry.id}`}
                >
                  <TableCell>{getAppreciationTypeLabel(t, entry.title)}</TableCell>
                  <TableCell $width="227px">
                    <StatusBadge $status={entry.status}>{getStatusLabel(entry)}</StatusBadge>
                  </TableCell>
                  <TableCell $width="146px" $noWrap>
                    {entry.status === AppreciationStatusType.PENDING && entry.dateDue ? (
                      formatDate(entry.dateDue)
                    ) : (
                      <EmptyPlaceholder />
                    )}
                  </TableCell>
                  <TableCell $width="146px" $noWrap>
                    {entry.status === AppreciationStatusType.POST && entry.dateDue ? (
                      formatDate(entry.dateDue)
                    ) : (
                      <EmptyPlaceholder />
                    )}
                  </TableCell>

                  <TableCell $width="146px" $noWrap>
                    {entry.dateDelivery ? formatDate(entry.dateDelivery) : <EmptyPlaceholder />}
                  </TableCell>
                  <ActionCell>
                    <ActionButton onClick={() => handleEdit(entry)} data-testid={`edit-button-${entry.id}`}>
                      <PencilSimple size={20} weight="regular" />
                    </ActionButton>
                  </ActionCell>
                  <ActionCell>
                    <ActionButton onClick={() => handleDelete(entry)} data-testid={`delete-button-${entry.id}`}>
                      <Trash size={20} weight="regular" />
                    </ActionButton>
                  </ActionCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AppreciationTableContainer>
      )}

      <AppreciationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={editingEntry}
      />

      {deleteConfirmEntry && (
        <ConfirmationDialog
          title={t("dashboard.appreciationSection.deleteConfirmTitle")}
          message={t("dashboard.appreciationSection.deleteConfirmText", {
            entryType: getAppreciationTypeLabel(t, deleteConfirmEntry.title),
          })}
          onCancel={() => setDeleteConfirmEntry(null)}
          onConfirm={confirmDelete}
        />
      )}
    </SectionWrapper>
  );
});
