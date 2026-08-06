import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiAgentGet, ApiOpportunityGet } from "need4deed-sdk";
import { useMemo } from "react";

export function useAgentContactOptions(opportunity: ApiOpportunityGet, isEnable: boolean) {
  const { data } = useGetQuery<ApiAgentGet>({
    apiPath: `${apiPathAgent}/${opportunity.agent.id}`,
    queryKey: ["agent", String(opportunity.agent.id)],
    enabled: isEnable,
    staleTime: cacheTTL,
    addLang: false,
  });
  const contactOptions = useMemo(
    () =>
      data?.contacts?.map((contact) => ({
        id: contact.person.id,
        title: [contact.person.firstName, contact.person.middleName, contact.person.lastName].filter(Boolean).join(" "),
      })) ?? [],
    [data?.contacts],
  );

  const nameIdMap = useMemo(() => createMapping(contactOptions), [contactOptions]);
  const options = useMemo(() => contactOptions.map((option) => option.title), [contactOptions]);

  return { nameIdMap, options };
}
