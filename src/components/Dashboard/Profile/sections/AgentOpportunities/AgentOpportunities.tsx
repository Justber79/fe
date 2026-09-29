import { Heading4 } from "@/components/styled/text";
import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiOpportunityGetList, Id } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Accordion } from "../shared/Accordion";
import { SectionEmptyState } from "../shared/styles";
import { AgentOpportunitiesContainer } from "./styles";

type Props = { agentId: Id };

export const AgentOpportunities = ({ agentId }: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { data, isLoading } = useGetQuery<ApiOpportunityGetList[]>({
    queryKey: ["agent-opportunities", String(agentId)],
    apiPath: `${apiPathAgent}/${agentId}/opportunity-linked`,
    staleTime: cacheTTL,
    enabled: !!agentId,
  });

  const opportunities = data ?? [];

  if (isLoading) return <AgentOpportunitiesContainer data-testid="agent-opportunities" />;

  return (
    <AgentOpportunitiesContainer data-testid="agent-opportunities">
      {opportunities.length === 0 ? (
        <SectionEmptyState>{t("dashboard.volunteerProfile.opportunitiesSec.emptyState")}</SectionEmptyState>
      ) : (
        opportunities.map((opp) => (
          <Accordion
            key={String(opp.id)}
            headerLeft={
              <Heading4 margin={0} color="var(--color-midnight)">
                {opp.title}
              </Heading4>
            }
            subtitle={opp.statusOpportunity ? t(`dashboard.opportunities.status.${opp.statusOpportunity}`) : "-"}
            onGoToProfile={() => router.push(`/${i18n.language}/dashboard/opportunities/${opp.id}`)}
          />
        ))
      )}
    </AgentOpportunitiesContainer>
  );
};
