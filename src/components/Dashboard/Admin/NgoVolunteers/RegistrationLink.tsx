"use client";

import { Button } from "@/components/core/button";
import { Heading4, Paragraph } from "@/components/styled/text";
import { useCreateRegistrationLink } from "@/hooks/useCreateRegistrationLink";
import { ApiAgentRegistrationLinkResponse } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Section } from "./styles";

const i18nPrefix = "dashboard.admin.ngoVolunteers.link";

export function RegistrationLink({ agentId }: { agentId: number }) {
  const { t, i18n } = useTranslation();
  const [link, setLink] = useState<ApiAgentRegistrationLinkResponse>();
  const { mutate: createLink, isPending } = useCreateRegistrationLink(agentId);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.link);
      toast.success(t(`${i18nPrefix}.copied`));
    } catch {
      toast.error(t(`${i18nPrefix}.copyFailed`));
    }
  };

  return (
    <Section>
      <Heading4 margin={0}>{t(`${i18nPrefix}.title`)}</Heading4>
      <Paragraph>{t(`${i18nPrefix}.helper`)}</Paragraph>
      <Button
        text={t(`${i18nPrefix}.create`)}
        width="auto"
        disabled={isPending}
        onClick={() => createLink(undefined, { onSuccess: setLink })}
      />
      {link && (
        <>
          <LinkText>{link.link}</LinkText>
          <Paragraph color="var(--color-grey-500)">
            {t(`${i18nPrefix}.expires`, { date: new Date(link.expiresAt).toLocaleDateString(i18n.language) })}
          </Paragraph>
          <Button text={t(`${i18nPrefix}.copy`)} width="auto" onClick={handleCopy} />
        </>
      )}
    </Section>
  );
}

const LinkText = styled.code`
  padding: var(--spacing-8) var(--spacing-12);
  border-radius: var(--spacing-8);
  background: var(--color-grey-50);
  overflow-wrap: anywhere;
`;
