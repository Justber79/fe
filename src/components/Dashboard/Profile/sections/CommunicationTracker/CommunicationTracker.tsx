import { useCommunicationTracker } from "@/hooks/useCommunicationTracker";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { ApiCommunicationGet, ApiVolunteerCommunicationPost, ApiVolunteerCommunicationPatch } from "need4deed-sdk";
import { EntityType } from "@/components/Dashboard/Profile/types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommunicationDialog } from "./CommunicationDialog";
import { ConfirmationDialog } from "../shared/ConfirmationDialog";
import { SectionWrapper, SectionEmptyState } from "../shared/styles";
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
import { CommunicationTableContainer } from "./styles";
import { formatDate, getDisplayLabel, getContactMethodLabel } from "./utils/translations";

type Props = {
  entityId: number;
  entityType: EntityType;
};

export type CommunicationTrackerRef = {
  handleAddNew: () => void;
};

export const CommunicationTracker = forwardRef<CommunicationTrackerRef, Props>(function CommunicationTracker(
  { entityId, entityType },
  ref,
) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ApiCommunicationGet | undefined>(undefined);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<ApiCommunicationGet | null>(null);

  const { communications, createCommunication, updateCommunication, deleteCommunication } = useCommunicationTracker(
    entityId,
    entityType,
  );

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleAddNew,
  }));

  const handleEdit = (entry: ApiCommunicationGet) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: ApiCommunicationGet) => {
    setDeleteConfirmEntry(entry);
  };

  const confirmDelete = () => {
    if (deleteConfirmEntry) {
      deleteCommunication(deleteConfirmEntry.id, {
        onSuccess: () => {
          setDeleteConfirmEntry(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmEntry(null);
  };

  const handleSave = (data: Partial<ApiCommunicationGet>) => {
    if (!data.contactType || !data.contactMethod || !data.date) {
      return;
    }

    if (data.id) {
      const payload: ApiVolunteerCommunicationPatch = {
        contactType: data.contactType,
        contactMethod: data.contactMethod,
        communicationType: data.communicationType!,
        date: data.date,
      };
      updateCommunication(
        { id: data.id, data: payload },
        {
          onSuccess: () => setIsDialogOpen(false),
        },
      );
    } else {
      const payload: ApiVolunteerCommunicationPost = {
        contactType: data.contactType,
        contactMethod: data.contactMethod,
        communicationType: data.communicationType!,
        date: data.date,
      };
      createCommunication(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  return (
    <SectionWrapper data-testid="communication-tracker-container" id={"communication-tracker-container"}>
      {communications.length === 0 ? (
        <SectionEmptyState data-testid="empty-state">
          {t("dashboard.communicationSection.emptyState", "No communications recorded yet")}
        </SectionEmptyState>
      ) : (
        <CommunicationTableContainer data-testid="communications-table">
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.communicationSection.typeOfContact")}</TableHeaderCell>
              <TableHeaderCell $maxWidth="310px">
                {t("dashboard.communicationSection.contactMethodLabel")}
              </TableHeaderCell>
              <TableHeaderCell $width="152px">{t("dashboard.communicationSection.date")}</TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)"></TableHeaderCell>
              <TableHeaderCell $width="var(--communication-tracker-action-column-width)"></TableHeaderCell>
            </TableHeader>
            <TableBody>
              {communications.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  $isLast={index === communications.length - 1}
                  data-testid={`communication-row-${entry.id}`}
                >
                  <TableCell>{getDisplayLabel(t, entry.contactType, entry.communicationType)}</TableCell>
                  <TableCell $maxWidth="310px">{getContactMethodLabel(t, entry.contactMethod)}</TableCell>
                  <TableCell $width="152px" $noWrap>
                    {formatDate(entry.date)}
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
        </CommunicationTableContainer>
      )}

      <CommunicationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={editingEntry}
      />

      {deleteConfirmEntry && (
        <ConfirmationDialog
          title={t("dashboard.communicationSection.deleteConfirmTitle")}
          message={t("dashboard.communicationSection.deleteConfirmText", {
            entryType: getDisplayLabel(t, deleteConfirmEntry.contactType, deleteConfirmEntry.communicationType),
          })}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </SectionWrapper>
  );
});
