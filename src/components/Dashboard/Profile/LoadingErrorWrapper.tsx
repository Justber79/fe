import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { Paragraph } from "@/components/styled/text";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedErrorMessage } from "@/utils/apiErrors";
import styled from "styled-components";
import { EntityType } from "./types";

const LoadingContainer = styled(CenteredWrapper)`
  padding: var(--volunteer-profile-loading-error-wrapper-padding);
`;

const ErrorContainer = styled(CenteredWrapper)`
  padding: var(--volunteer-profile-loading-error-wrapper-padding);
  color: var(--color-red-600);
`;

type Props = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data: unknown;
  entityType: EntityType;
  children: ReactNode;
};

export const LoadingErrorWrapper = ({ isLoading, isError, error, data, entityType, children }: Props) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Paragraph>Loading {entityType} profile...</Paragraph>
      </LoadingContainer>
    );
  }

  if (isError) {
    return (
      <ErrorContainer>
        <Paragraph>{getLocalizedErrorMessage(error, t)}</Paragraph>
      </ErrorContainer>
    );
  }

  if (!data) {
    return (
      <ErrorContainer>
        <Paragraph>No {entityType} data available.</Paragraph>
      </ErrorContainer>
    );
  }

  return <>{children}</>;
};
