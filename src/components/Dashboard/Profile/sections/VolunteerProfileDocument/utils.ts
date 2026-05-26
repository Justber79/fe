import { ApiDocumentGet, DocumentStatusType, DocumentType } from "need4deed-sdk";

// TODO: remove once SDK >= 0.0.82 is published (BE issue need4deed-org/be#481)
type ApiVolunteerGet = import("need4deed-sdk").ApiVolunteerGet & {
  statusVaccinationDate?: Date | null;
  statusCGCApplicationDate?: Date | null;
  statusCGCDate?: Date | null;
};

export type DocumentRow = {
  type: DocumentType;
  nameKey: string;
  isUploaded: boolean;
  document?: ApiDocumentGet;
  isReceived: boolean;
  receivedAt: Date | null;
};

const DOCUMENT_NAME_KEYS: Record<DocumentType, string> = {
  "measles-vacc-cert": "measlesVaccination",
  "CGC-application": "applicationCertificateGoodConduct",
  "good-conduct-cert": "certificateGoodConduct",
  "passport-copy": "passport",
};

export const getDocumentNameKey = (type: DocumentType): string => {
  return DOCUMENT_NAME_KEYS[type];
};

export const formatDocumentDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const extractDocumentUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("url");
  } catch {
    return null;
  }
};

export const enrichDocuments = (
  fetchedDocuments: ApiDocumentGet[],
  volunteer: ApiVolunteerGet,
  passportReceived: boolean,
  passportReceivedAt: Date | null,
): DocumentRow[] => {
  const allTypes = Object.keys(DOCUMENT_NAME_KEYS) as DocumentType[];

  return allTypes.map((type) => {
    const document = fetchedDocuments.find((doc) => doc.type === type);

    let isReceived = false;
    switch (type) {
      case DocumentType.MEASLES_VACCINATION:
        isReceived = volunteer.measlesVaccination === DocumentStatusType.YES;
        break;
      case DocumentType.CGC:
        isReceived = volunteer.goodConductCertificate === DocumentStatusType.YES;
        break;
      case DocumentType.CGC_APPLICATION:
        isReceived = volunteer.goodConductCertificate === DocumentStatusType.APPLIED_N4D;
        break;
      case DocumentType.PASSPORT_ID:
        isReceived = passportReceived;
        break;
    }

    let receivedAt: Date | null = null;
    switch (type) {
      case DocumentType.MEASLES_VACCINATION:
        receivedAt = volunteer.statusVaccinationDate ? new Date(volunteer.statusVaccinationDate) : null;
        break;
      case DocumentType.CGC:
        receivedAt = volunteer.statusCGCDate ? new Date(volunteer.statusCGCDate) : null;
        break;
      case DocumentType.CGC_APPLICATION:
        receivedAt = volunteer.statusCGCApplicationDate ? new Date(volunteer.statusCGCApplicationDate) : null;
        break;
      case DocumentType.PASSPORT_ID:
        receivedAt = passportReceivedAt;
        break;
    }

    return {
      type,
      nameKey: DOCUMENT_NAME_KEYS[type],
      isUploaded: !!document,
      document,
      isReceived,
      receivedAt,
    };
  });
};
