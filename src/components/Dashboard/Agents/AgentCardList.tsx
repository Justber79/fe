import type { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { PaginatedGrid } from "@/components/core/paginatedGrid";
import { AgentCard } from "./AgentCard";
import { AgentCardListContainer } from "./styles";

type Props = {
  agents: ApiAgentGetList[];
  count: number;
  columns: number;
  rows: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  districtsList?: OptionItem[];
};

export function AgentCardList({ agents, count, columns, rows, currentPage, setCurrentPage, districtsList }: Props) {
  const items = agents.map((agent) => <AgentCard key={agent.id} agent={agent} districtsList={districtsList} />);

  return (
    <AgentCardListContainer data-testid="agent-card-list">
      <PaginatedGrid
        pageItems={items}
        columns={columns}
        rows={rows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItemCounts={count}
      />
    </AgentCardListContainer>
  );
}
