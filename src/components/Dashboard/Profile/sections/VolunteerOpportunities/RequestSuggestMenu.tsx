import { ItemText, Menu } from "@/components/core/menu";
import { Paragraph } from "@/components/styled/text";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { useGetMultiOpportunityLinked } from "@/hooks/useGetMultiOpportunityLinked";
import { ApiOpportunityGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (opportunityTitle: string) => void;
};

const MenuAnchor = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export function RequestSuggestMenu({ isOpen, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  const { agentIds } = useGetCurrentAgent();
  const { allLinkedOpportunities, isLoading } = useGetMultiOpportunityLinked(agentIds);
  const opportunities = allLinkedOpportunities as ApiOpportunityGetList[];

  return (
    <MenuAnchor>
      <Menu open={isOpen} onClose={onClose}>
        <Menu.Dropdown align="right">
          {isLoading && <Paragraph margin="var(--spacing-12)">{t("dashboard.home.content.loading")}</Paragraph>}
          {!isLoading && opportunities.length === 0 && (
            <Paragraph margin="var(--spacing-12)">
              {t("dashboard.volunteerProfile.requestSuggest.noOpportunities")}
            </Paragraph>
          )}
          {opportunities.map((opp) => (
            <Menu.Item key={opp.id} onSelect={() => onSelect(opp.title)}>
              <ItemText>{opp.title}</ItemText>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </MenuAnchor>
  );
}
