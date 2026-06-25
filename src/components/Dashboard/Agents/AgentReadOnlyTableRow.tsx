import { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { ClickableRow, TableCell } from "@/components/core/common/Table";

interface Props {
  agent: ApiAgentGetList;
  isLast: boolean;
  typeLabels: Record<string, string>;
  searchLabels: Record<string, string>;
  districtsList?: OptionItem[];
}

export function AgentReadOnlyTableRow({ agent, isLast, districtsList }: Props) {
  const { id, title, type, district } = agent;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;

  return (
    <ClickableRow $isLast={isLast} $cursor={"auto"} data-testid={`agent-row-${id}`}>
      <TableCell data-testid={`agent-title-${id}`}>{title}</TableCell>
      <TableCell data-testid={`agent-type-${id}`}>{type}</TableCell>
      <TableCell data-testid={`agent-district-${id}`}>{districtTitle || "—"}</TableCell>
    </ClickableRow>
  );
}
