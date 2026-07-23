import { Button } from "@/components/core/button";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-16);
`;

type Props = {
  deleteButtonText: string;
  onDeleteClick: () => void;
  deleteDisabled?: boolean;
  transferButtonText?: string;
  onTransferClick?: () => void;
};

export const DangerZoneButtonRow = ({
  deleteButtonText,
  onDeleteClick,
  deleteDisabled,
  transferButtonText,
  onTransferClick,
}: Props) => {
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
      <Button
        text={deleteButtonText}
        onClick={onDeleteClick}
        backgroundcolor="var(--color-aubergine)"
        textColor="var(--color-white)"
        disabled={deleteDisabled}
      />
    </Row>
  );
};
