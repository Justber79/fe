import { ApiDocumentGet, ApiVolunteerGet, DocumentStatusType, DocumentType } from "need4deed-sdk";

// These fields are not yet in ApiVolunteerGet SDK type
type ExtendedVolunteerGet = ApiVolunteerGet & {
  statusVaccinationDate?: string | Date | null;
  statusCGCDate?: string | Date | null;
  statusCGCApplicationDate?: string | Date | null;
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
      case DocumentType.MEASLES_VACCINATION: {
        const ext = volunteer as ExtendedVolunteerGet;
        receivedAt = ext.statusVaccinationDate ? new Date(ext.statusVaccinationDate as string) : null;
        break;
      }
      case DocumentType.CGC: {
        const ext = volunteer as ExtendedVolunteerGet;
        receivedAt = ext.statusCGCDate ? new Date(ext.statusCGCDate as string) : null;
        break;
      }
      case DocumentType.CGC_APPLICATION: {
        const ext = volunteer as ExtendedVolunteerGet;
        receivedAt = ext.statusCGCApplicationDate ? new Date(ext.statusCGCApplicationDate as string) : null;
        break;
      }
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
