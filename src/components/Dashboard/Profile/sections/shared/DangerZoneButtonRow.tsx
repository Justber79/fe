import { Button } from "@/components/core/button";
import { useId } from "react";

import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-16);
`;

const DeleteColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-8);
`;

const HelperText = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-grey-500);
  margin: 0;
`;

type Props = {
  deleteButtonText: string;
  onDeleteClick: () => void;
  deleteDisabled?: boolean;
  transferButtonText?: string;
  onTransferClick?: () => void;
  blockedMessage?: string;
};

export const DangerZoneButtonRow = ({
  deleteButtonText,
  onDeleteClick,
  deleteDisabled,
  transferButtonText,
  onTransferClick,
  blockedMessage,
}: Props) => {
  const blockedReasonId = useId();

  return (
    <Row>
      {transferButtonText && onTransferClick && (
        <Button
          text={transferButtonText}
          onClick={onTransferClick}
          backgroundcolor="transparent"
          textColor="var(--color-aubergine)"
          border="var(--border-width-medium) solid var(--color-aubergine)"
        />
      )}
      <DeleteColumn>
        <Button
          text={deleteButtonText}
          onClick={onDeleteClick}
          backgroundcolor="var(--color-aubergine)"
          textColor="var(--color-white)"
          disabled={deleteDisabled}
          aria-describedby={deleteDisabled && blockedMessage ? blockedReasonId : undefined}
        />
        {deleteDisabled && blockedMessage && <HelperText id={blockedReasonId}>{blockedMessage}</HelperText>}
      </DeleteColumn>
    </Row>
  );
};
