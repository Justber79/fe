"use client";

import { Button } from "@/components/core/button";
import { FormInput } from "@/components/core/common";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { ActionCell, Table, TableBody, TableCell, TableContainer, TableRow } from "@/components/core/common/Table";
import { ActionButtonWithTooltip } from "@/components/Dashboard/common/ActionButtonWithTooltip";
import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { Paragraph } from "@/components/styled/text";
import { useTrustedDomains } from "@/hooks/useTrustedDomains";
import { TrashIcon } from "@phosphor-icons/react";
import { ApiTrustedDomain } from "need4deed-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { z } from "zod";
import { isValidDomain } from "./helpers";

const domainSchema = z.object({ domain: z.string().refine(isValidDomain) });

type DomainFormInput = { domain: string };

export function TrustedDomains() {
  const { t } = useTranslation();
  const [domainToRemove, setDomainToRemove] = useState<ApiTrustedDomain | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isValid },
  } = useForm<DomainFormInput>({
    mode: "onChange",
    resolver: zodResolver(domainSchema),
    defaultValues: { domain: "" },
  });
  const { domains, isLoading, isError, addDomain, isAdding, removeDomain, isRemoving } = useTrustedDomains(() =>
    setError("domain", { type: "duplicate", message: t("dashboard.admin.domains.duplicate") }),
  );

  const onSubmit = ({ domain }: DomainFormInput) => addDomain({ domain }, { onSuccess: () => reset() });

  const handleConfirmRemove = () => {
    if (!domainToRemove) return;
    removeDomain(domainToRemove.id, { onSettled: () => setDomainToRemove(null) });
  };

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.domains.helper")}</Paragraph>

      <AddForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputWrapper>
          <Controller
            name="domain"
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                placeHolder={t("dashboard.admin.domains.placeholder")}
                value={field.value}
                onInputChange={(value) => !isAdding && field.onChange(value.trim().toLowerCase())}
                errors={fieldState.error?.type === "duplicate" ? [fieldState.error.message] : undefined}
              />
            )}
          />
        </InputWrapper>
        <Button type="submit" text={t("dashboard.admin.domains.add")} disabled={isAdding || !isValid} width="auto" />
      </AddForm>

      {isLoading ? (
        <DashboardListLoading />
      ) : isError ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.domains.loadError")}</Paragraph>
      ) : domains.length === 0 ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.domains.empty")}</Paragraph>
      ) : (
        <TableContainer>
          <Table>
            <TableBody>
              {domains.map((trustedDomain, index) => (
                <TableRow key={trustedDomain.id} $isLast={index === domains.length - 1}>
                  <TableCell>{trustedDomain.domain}</TableCell>
                  <ActionCell>
                    <ActionButtonWithTooltip
                      tooltipText={t("dashboard.admin.domains.remove")}
                      ariaLabel={t("dashboard.admin.domains.removeAria", { domain: trustedDomain.domain })}
                      onClick={() => setDomainToRemove(trustedDomain)}
                    >
                      <TrashIcon size={20} />
                    </ActionButtonWithTooltip>
                  </ActionCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {domainToRemove && (
        <ConfirmationDialog
          title={t("dashboard.admin.domains.removeTitle")}
          message={t("dashboard.admin.domains.removeMessage", { domain: domainToRemove.domain })}
          confirmText={t("dashboard.admin.domains.remove")}
          onCancel={() => setDomainToRemove(null)}
          onConfirm={handleConfirmRemove}
          cancelDisabled={isRemoving}
          confirmDisabled={isRemoving}
        />
      )}
    </Container>
  );
}

export default TrustedDomains;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  max-width: 640px;
`;

const AddForm = styled.form`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-12);

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  --form-input-container-height: var(--button-height);
  --form-input-container-border-radius: var(--button-border-radius);
  --form-input-container-padding: 0 var(--spacing-24);
  --form-input-container-border: 1px solid var(--color-grey-200);
  --form-input-container-border-focus: 2px solid var(--color-green-200);
  --form-input-container-border-error: 2px solid var(--color-red-600);
  --form-input-fontSize: var(--text-p-font-size);
`;
