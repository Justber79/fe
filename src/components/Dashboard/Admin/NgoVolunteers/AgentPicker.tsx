"use client";

import { Button } from "@/components/core/button";
import { FormInput } from "@/components/core/common";
import { Heading4, Paragraph } from "@/components/styled/text";
import { AgentOption, useAgentSearch } from "@/hooks/useAgentSearch";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { InputWrapper } from "./styles";

const i18nPrefix = "dashboard.admin.ngoVolunteers";

type Props = {
  selected?: AgentOption;
  onSelect: (agent?: AgentOption) => void;
};

export function AgentPicker({ selected, onSelect }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { agents, isSettled } = useAgentSearch(search, !selected);

  if (selected) {
    return (
      <SelectedRow>
        <Heading4 margin={0}>{selected.title}</Heading4>
        <Button
          text={t(`${i18nPrefix}.change`)}
          width="auto"
          onClick={() => {
            setSearch("");
            onSelect(undefined);
          }}
        />
      </SelectedRow>
    );
  }

  return (
    <>
      <InputWrapper>
        <FormInput placeHolder={t(`${i18nPrefix}.search`)} value={search} onInputChange={setSearch} />
      </InputWrapper>
      {isSettled && agents.length === 0 && (
        <Paragraph color="var(--color-grey-500)">{t(`${i18nPrefix}.noResults`)}</Paragraph>
      )}
      <Results>
        {agents.map((agent) => (
          <ResultButton key={agent.id} type="button" onClick={() => onSelect(agent)}>
            {agent.isInactive ? t(`${i18nPrefix}.inactive`, { title: agent.title }) : agent.title}
          </ResultButton>
        ))}
      </Results>
    </>
  );
}

const SelectedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-12);
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const ResultButton = styled.button`
  padding: var(--spacing-8) var(--spacing-12);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--spacing-8);
  background: var(--color-white);
  color: var(--color-midnight);
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: var(--color-orchid-subtle);
  }
`;
