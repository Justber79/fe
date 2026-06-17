import { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import { ClickableRow, TableCell } from "@/components/core/common/Table";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface Props {
  agent: ApiAgentGetList;
  isLast: boolean;
  typeLabels: Record<string, string>;
  searchLabels: Record<string, string>;
  districtsList?: OptionItem[];
}

export function AgentReadOnlyTableRow({ agent, isLast, districtsList }: Props) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { id, title, type, district } = agent;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;

  const handleGoToProfile = () => {
    if (!id) return;
    router.push(`/${i18n.language}/dashboard/agents/${id}`);
  };
  return (
    <ClickableRow $isLast={isLast} $cursor={"auto"} data-testid={`agent-row-${id}`} onClick={handleGoToProfile}>
      <TableCell data-testid={`agent-title-${id}`}>{title}</TableCell>
      <TableCell data-testid={`agent-type-${id}`}>{type}</TableCell>
      <TableCell data-testid={`agent-district-${id}`}>{districtTitle || "—"}</TableCell>
    </ClickableRow>
  );
}
