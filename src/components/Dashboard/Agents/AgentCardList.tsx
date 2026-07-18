import type { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { PaginatedGrid } from "@/components/core/paginatedGrid";
import { AgentCard } from "./AgentCard";
import { AgentCardListContainer } from "./styles";
import { AgentReadOnlyCard } from "./AgentReadOnlyCard";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  agents: ApiAgentGetList[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  districtsList?: OptionItem[];
};

export function AgentCardList({ agents, count, itemsPerPage, currentPage, setCurrentPage, districtsList }: Props) {
  const { isAuthorized } = useAuth();

  const items = agents.map((agent) =>
    isAuthorized ? (
      <AgentCard key={agent.id} agent={agent} districtsList={districtsList} />
    ) : (
      <AgentReadOnlyCard key={agent.id} agent={agent} districtsList={districtsList} />
    ),
  );

  return (
    <AgentCardListContainer data-testid="agent-card-list">
      <PaginatedGrid
        pageItems={items}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItemCounts={count}
      />
    </AgentCardListContainer>
  );
}
