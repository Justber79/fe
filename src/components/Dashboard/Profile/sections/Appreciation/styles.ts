import styled from "styled-components";
import { TableContainer } from "@/components/core/common/Table";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { AppreciationStatusType } from "need4deed-sdk";

export const AppreciationTableContainer = styled(TableContainer)`
  margin-top: var(--spacing-24);
`;

const statusColorMap: Record<AppreciationStatusType, string> = {
  [AppreciationStatusType.RECEIVED]: "var(--color-green-100)",
  [AppreciationStatusType.POST]: "var(--color-blue-100)",
  [AppreciationStatusType.PENDING]: "var(--color-red-50)",
};

export const StatusBadge = styled.div<{ $status: AppreciationStatusType }>`
  background: ${(props) => statusColorMap[props.$status] ?? "var(--color-grey-50)"};
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
`;

export const DialogTitle = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: var(--dialog-title-font-size);
  line-height: var(--dialog-title-line-height);
  letter-spacing: var(--dialog-title-letter-spacing);
  color: var(--color-midnight);
  margin: 0 0 var(--spacing-24) 0;
`;

export const RadioOptionsContainer = styled(FlexColumn).attrs({
  $gap: "var(--spacing-24)",
  $width: "100%",
})``;

export const ExpandedSection = styled(FlexColumn).attrs({
  $gap: "var(--spacing-16)",
})`
  padding-left: var(--spacing-32);
  border-left: var(--expanded-section-border-width) solid var(--expanded-section-border-color);
  margin-top: var(--spacing-8);
`;

export const SubQuestion = styled.p`
  font-family: var(--bs-body-font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-24);
  letter-spacing: var(--sub-question-letter-spacing);
  color: var(--color-grey-700);
  margin: 0;
`;

export const SubOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const DateFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: var(--spacing-8);
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: var(--color-grey-50);
  margin: var(--spacing-24) 0;
`;
