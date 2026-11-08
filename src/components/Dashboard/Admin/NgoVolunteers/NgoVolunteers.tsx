"use client";

import { Paragraph } from "@/components/styled/text";
import { AgentOption } from "@/hooks/useAgentSearch";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AgentPicker } from "./AgentPicker";
import { RegistrationLink } from "./RegistrationLink";
import { Container, Section } from "./styles";

export function NgoVolunteers() {
  const { t } = useTranslation();
  const [agent, setAgent] = useState<AgentOption>();

  return (
    <Container>
      <Paragraph>{t("dashboard.admin.ngoVolunteers.helper")}</Paragraph>
      <Section>
        <AgentPicker selected={agent} onSelect={setAgent} />
      </Section>
      {agent && <RegistrationLink key={agent.id} agentId={agent.id} />}
    </Container>
  );
}

export default NgoVolunteers;
