"use client";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { TOTAL_STEPS } from "./types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
`;

const StepLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-grey-500);
`;

const Track = styled.div`
  display: flex;
  gap: 6px;
`;

interface SegmentProps {
  $active: boolean;
}

const Segment = styled.div<SegmentProps>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ $active }) => ($active ? "var(--color-aubergine)" : "var(--color-grey-200)")};
  transition: background 0.2s ease;
`;

interface Props {
  currentStep: number;
}

export function ProgressBar({ currentStep }: Props) {
  const { t } = useTranslation();

  return (
    <Container>
      <StepLabel>
        {t("agentRegistration.step")} {currentStep} / {TOTAL_STEPS}
      </StepLabel>
      <Track>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <Segment key={i} $active={i < currentStep} />
        ))}
      </Track>
    </Container>
  );
}
