"use client";
import { useVolunteerDocuments } from "@/hooks/useVolunteerDocuments";
import { ApiVolunteerGet, DocumentStatusType, DocumentType } from "need4deed-sdk";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "../shared/ConfirmationDialog";
import { SectionWrapper } from "../shared/styles";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { DocumentTableRow } from "./DocumentTableRow";
import { ACTION_COLUMN_WIDTH, DocumentTableContainer, HeaderCell, Table, TableHeader } from "./styles";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { useDialogState } from "./useDialogState";
import { useDeleteDocument, useUpdateVolunteerDocStatus, useUploadDocument } from "./useDocumentOperations";
import { DocumentRow, enrichDocuments, extractDocumentUrl } from "./utils";

type Props = {
  volunteer: ApiVolunteerGet;
};

export function VolunteerProfileDocument({ volunteer }: Props) {
  const { t } = useTranslation();
  const {
    deleteDocument: deleteDialogDocument,
    uploadDocument: uploadDialogDocument,
    previewDocument,
    openDialog,
    closeDialog,
    isDeleteOpen,
    isUploadOpen,
    isPreviewOpen,
  } = useDialogState();

  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [passportReceived, setPassportReceived] = useState(false);
  const [passportReceivedAt, setPassportReceivedAt] = useState<Date | null>(null);

  const { data: fetchedDocuments, isLoading, isError } = useVolunteerDocuments(volunteer.id);

  const documentRows = useMemo(
    () => (fetchedDocuments ? enrichDocuments(fetchedDocuments, volunteer, passportReceived, passportReceivedAt) : []),
    [fetchedDocuments, volunteer, passportReceived, passportReceivedAt],
  );

  const uploadMutation = useUploadDocument(volunteer.id, () => closeDialog("upload"));
  const deleteMutation = useDeleteDocument(volunteer.id, () => {
    closeDialog("delete");
    closeDialog("preview");
  });
  const docStatusMutation = useUpdateVolunteerDocStatus(volunteer.id);

  const handleToggleReceived = (type: DocumentType, currentIsReceived: boolean) => {
    switch (type) {
      case DocumentType.MEASLES_VACCINATION:
        docStatusMutation.mutate({
          measlesVaccination: currentIsReceived ? DocumentStatusType.NO : DocumentStatusType.YES,
        });
        break;
      case DocumentType.CGC:
        docStatusMutation.mutate({
          goodConductCertificate: currentIsReceived ? DocumentStatusType.NO : DocumentStatusType.YES,
        });
        break;
      case DocumentType.CGC_APPLICATION:
        // If the cert itself is already confirmed (YES), the application stage is superseded — ignore
        if (volunteer.goodConductCertificate === DocumentStatusType.YES) return;
        docStatusMutation.mutate({
          goodConductCertificate: currentIsReceived ? DocumentStatusType.NO : DocumentStatusType.APPLIED_N4D,
        });
        break;
      case DocumentType.PASSPORT_ID:
        setPassportReceived((prev) => {
          const next = !prev;
          setPassportReceivedAt(next ? new Date() : null);
          return next;
        });
        break;
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDialogDocument) {
      deleteMutation.mutate({
        volunteerId: volunteer.id,
        documentType: deleteDialogDocument.type,
      });
    }
  };

  const handleConfirmUpload = (file: File) => {
    if (uploadDialogDocument) {
      uploadMutation.mutate({
        volunteerId: volunteer.id,
        file,
        documentType: uploadDialogDocument.type,
      });
    }
  };

  const handleDownload = (row: DocumentRow) => {
    if (!row.document?.url) return;

    const link = document.createElement("a");
    link.href = row.document.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (row: DocumentRow) => {
    if (!row.document?.url) {
      toast.error(t("message.previewError"));
      return;
    }

    const actualUrl = extractDocumentUrl(row.document.url);
    if (!actualUrl) {
      toast.error(t("message.previewError"));
      return;
    }

    setDocumentUrl(actualUrl);
    openDialog("preview", row);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading documents.</div>;
  }

  return (
    <>
      <SectionWrapper data-testid="volunteer-profile-document-container">
        <DocumentTableContainer>
          <Table>
            <TableHeader>
              <HeaderCell>{t("dashboard.documentSection.typeOfDocument")}</HeaderCell>
              <HeaderCell $width="120px" $noWrap>
                {t("dashboard.documentSection.received")}
              </HeaderCell>
              <HeaderCell $width="180px">{t("dashboard.documentSection.status")}</HeaderCell>
              <HeaderCell $width="152px" $noWrap>
                {t("dashboard.documentSection.uploadedOn")}
              </HeaderCell>
              <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
              <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
              <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
              <HeaderCell $width={ACTION_COLUMN_WIDTH}></HeaderCell>
            </TableHeader>

            {documentRows.map((row, index) => (
              <DocumentTableRow
                key={row.type}
                documentRow={row}
                isLast={index === documentRows.length - 1}
                onUpload={() => openDialog("upload", row)}
                onPreview={() => handlePreview(row)}
                onDownload={() => handleDownload(row)}
                onDelete={() => openDialog("delete", row)}
                onToggleReceived={() => handleToggleReceived(row.type, row.isReceived)}
              />
            ))}
          </Table>
        </DocumentTableContainer>
      </SectionWrapper>

      {isDeleteOpen && (
        <ConfirmationDialog
          title={t("dashboard.documentSection.deleteDialog.title")}
          message={t("dashboard.documentSection.deleteDialog.message", {
            documentName: t(`dashboard.documentSection.documentNames.${deleteDialogDocument?.nameKey}`),
          })}
          confirmText={t("dashboard.documentSection.deleteDialog.delete")}
          cancelText={t("dashboard.documentSection.deleteDialog.cancel")}
          onCancel={() => closeDialog("delete")}
          onConfirm={handleConfirmDelete}
        />
      )}

      <UploadDocumentDialog
        key={uploadDialogDocument?.type}
        isOpen={isUploadOpen}
        documentName={
          uploadDialogDocument?.nameKey
            ? t(`dashboard.documentSection.documentNames.${uploadDialogDocument.nameKey}`)
            : ""
        }
        onCancel={() => closeDialog("upload")}
        onUpload={handleConfirmUpload}
        isUploading={uploadMutation.isPending}
      />

      <DocumentPreviewDialog
        isOpen={isPreviewOpen}
        documentName={
          previewDocument?.nameKey ? t(`dashboard.documentSection.documentNames.${previewDocument.nameKey}`) : ""
        }
        documentUrl={documentUrl}
        onClose={() => closeDialog("preview")}
        onDownload={() => previewDocument && handleDownload(previewDocument)}
        onDelete={() => previewDocument && openDialog("delete", previewDocument)}
      />
    </>
  );
}
