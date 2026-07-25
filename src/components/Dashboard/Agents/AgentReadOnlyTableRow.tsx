import { ApiAgentGetList, Lang, OptionItem } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { extractOptionTitle } from "@/components/Dashboard/Profile/sections/OpportunityDetails/formatters";

interface Props {
  agent: ApiAgentGetList;
  isLast: boolean;
  districtsList?: OptionItem[];
}

export function AgentReadOnlyTableRow({ agent, isLast, districtsList }: Props) {
  const { i18n } = useTranslation();
  const { id, title, type, district } = agent;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;
  const lang = i18n.language as Lang;

  return (
    <ClickableRow $isLast={isLast} $cursor={"auto"} data-testid={`agent-row-${id}`}>
      <TableCell data-testid={`agent-title-${id}`}>{title}</TableCell>
      <TableCell data-testid={`agent-type-${id}`}>{extractOptionTitle(type, lang)}</TableCell>
      <TableCell data-testid={`agent-district-${id}`}>{districtTitle || "—"}</TableCell>
    </ClickableRow>
  );
}
