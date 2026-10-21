import { apiPathVolunteer } from "@/config/constants";
import { communicationsQuery } from "@/hooks/useCommunicationTracker";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ApiCommunicationGet,
  ApiVolunteerApplicationEmailPost,
  ApiVolunteerGet,
  CommunicationType,
  DocumentStatusType,
  DocumentType,
} from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type UploadMetaResponse = {
  url: string;
  fields: Record<string, string>;
};

type UploadDocumentPayload = {
  volunteerId: number;
  file: File;
  documentType: DocumentType;
};

type DeleteDocumentPayload = {
  volunteerId: number;
  documentType: DocumentType;
};

const getUploadMeta = async (
  volunteerId: number,
  mimeType: string,
  originalName: string,
  type: DocumentType,
): Promise<UploadMetaResponse> => {
  const response = await axios.get(`${apiPathVolunteer}/${volunteerId}/doc/upload-meta`, {
    params: { mimeType, originalName, type },
  });
  return response.data;
};

const uploadToS3 = async (url: string, fields: Record<string, string>, file: File): Promise<void> => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteDocumentApi = async (volunteerId: number, documentType: DocumentType): Promise<void> => {
  await axios.delete(`${apiPathVolunteer}/${volunteerId}/doc/${documentType}`);
};

type DocStatusPayload = {
  goodConductCertificate?: DocumentStatusType;
  measlesVaccination?: DocumentStatusType;
};

export const useUploadDocument = (volunteerId: number, onSuccess?: () => void) => {
  const { t } = useTranslation();

  const uploadDocumentMutationFn = async ({ file, documentType }: UploadDocumentPayload) => {
    const meta = await getUploadMeta(volunteerId, file.type, file.name, documentType);
    await uploadToS3(meta.url, meta.fields, file);
  };

  return useMutationQuery<UploadDocumentPayload, void>({
    mutationFn: uploadDocumentMutationFn,
    successMessage: t("message.uploadSuccess"),
    queryKeyToInvalidate: ["volunteerDocuments", volunteerId.toString()],
    onSuccessCallback: onSuccess,
  });
};

export const useDeleteDocument = (volunteerId: number, onSuccess?: () => void) => {
  const { t } = useTranslation();

  return useMutationQuery<DeleteDocumentPayload, void>({
    mutationFn: ({ documentType }) => deleteDocumentApi(volunteerId, documentType),
    successMessage: t("message.deleteSuccess"),
    queryKeyToInvalidate: ["volunteerDocuments", volunteerId.toString()],
    onSuccessCallback: onSuccess,
  });
};

export const useUpdateVolunteerDocStatus = (volunteerId: number) => {
  return useMutationQuery<DocStatusPayload, { message: string; data: ApiVolunteerGet }>({
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    method: "patch",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};

export const useSendApplicationEmail = (volunteerId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutationQuery<void, { message: string; data: ApiVolunteerApplicationEmailPost }>({
    apiPath: `${apiPathVolunteer}/${volunteerId}/doc/application-email`,
    method: "post",
    successMessage: "message.applicationEmailSent",
    queryKeyToInvalidate: communicationsQuery("volunteer", volunteerId).queryKey,
    onErrorCallback: (error) => {
      if (!axios.isAxiosError(error)) return false;
      switch (error.response?.status) {
        case 409:
          queryClient.invalidateQueries({ queryKey: communicationsQuery("volunteer", volunteerId).queryKey });
          toast.error(t("message.applicationEmailJustSent"));
          return true;
        case 502:
          toast.error(t("message.applicationEmailNotSent"));
          return true;
        default:
          return false;
      }
    },
  });
};

export const useApplicationEmailSentAt = (volunteerId: number, enabled: boolean): Date | null => {
  const { data: communications } = useGetQuery<ApiCommunicationGet[]>({
    ...communicationsQuery("volunteer", volunteerId),
    enabled,
  });

  return useMemo(() => {
    const sentTimes = (communications ?? [])
      .filter(({ communicationType }) => communicationType === CommunicationType.CGC_APPLICATION_EMAIL)
      .map(({ date }) => new Date(date).getTime());
    return sentTimes.length ? new Date(Math.max(...sentTimes)) : null;
  }, [communications]);
};
