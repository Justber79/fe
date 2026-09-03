import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  compact?: boolean;
  cancelDisabled?: boolean;
  confirmDisabled?: boolean;
};

const Title = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-24);
  line-height: var(--line-height-32);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0;
`;

const Message = styled.p`
  font-weight: var(--font-weight-regular);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: var(--spacing-24);
`;

export function ConfirmationDialog({
  title,
  message,
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
  compact = false,
  cancelDisabled = false,
  confirmDisabled = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <Modal isOpen onClose={cancelDisabled ? () => undefined : onCancel}>
      <div
        data-testid="confirmation-dialog"
        style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}
      >
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button
            text={cancelText || t("dashboard.communicationSection.cancel", "Cancel")}
            onClick={onCancel}
            disabled={cancelDisabled}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
            height={compact ? "40px" : undefined}
            padding={compact ? "var(--spacing-8) var(--spacing-16)" : undefined}
            textFontSize={compact ? "var(--font-size-sm)" : undefined}
          />
          <Button
            text={confirmText || t("dashboard.communicationSection.delete", "Delete")}
            onClick={onConfirm}
            disabled={confirmDisabled}
            backgroundcolor="var(--color-aubergine)"
            textColor="var(--color-white)"
            height={compact ? "40px" : undefined}
            padding={compact ? "var(--spacing-8) var(--spacing-16)" : undefined}
            textFontSize={compact ? "var(--font-size-sm)" : undefined}
          />
        </ButtonGroup>
      </div>
    </Modal>
  );
}
