import { ItemContentWrapper, ItemText, Menu } from "@/components/core/menu";
import { Paragraph } from "@/components/styled/text";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { useGetMultiOpportunityLinked } from "@/hooks/useGetMultiOpportunityLinked";
import { ApiOpportunityGetList, OpportunityStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { CommuteBadge } from "../../common/CommuteBadge";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (opportunity: Pick<ApiOpportunityGetList, "id" | "title">) => void;
  excludeOpportunityIds?: number[];
  openOnly?: boolean;
};

const OPEN_STATUSES = [OpportunityStatusType.NEW, OpportunityStatusType.SEARCHING, OpportunityStatusType.ACTIVE];

const MenuAnchor = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export function RequestSuggestMenu({ isOpen, onClose, onSelect, excludeOpportunityIds = [], openOnly = false }: Props) {
  const { t } = useTranslation();
  const { agentIds } = useGetCurrentAgent();
  const { allLinkedOpportunities, isLoading } = useGetMultiOpportunityLinked(agentIds);
  const opportunities = (allLinkedOpportunities as ApiOpportunityGetList[]).filter(
    (opp) =>
      !excludeOpportunityIds.includes(Number(opp.id)) && (!openOnly || OPEN_STATUSES.includes(opp.statusOpportunity)),
  );

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
            <Menu.Item key={opp.id} onSelect={() => onSelect(opp)}>
              <ItemContentWrapper>
                <ItemText>{opp.title}</ItemText>
                <CommuteBadge min={25} max={35} />
              </ItemContentWrapper>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </MenuAnchor>
  );
}
