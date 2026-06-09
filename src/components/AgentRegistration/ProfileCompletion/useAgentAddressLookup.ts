import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetQuery } from "@/hooks";
import { ApiAgentGetList } from "need4deed-sdk";
import { useState } from "react";

// Powers the self-registration picker: as the user types their street, look up
// existing agents at a matching address so they can JOIN their org instead of
// creating a duplicate. Backed by GET /agent?filter[street]=.
export function useAgentAddressLookup(addressStreet: string) {
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [dismissedAddress, setDismissedAddress] = useState<string | null>(null);
  const debouncedAddress = useDebounce(addressStreet.trim(), 400);

  const enabled = debouncedAddress.length >= 5;

  const { data: matches, isLoading } = useGetQuery<ApiAgentGetList[]>({
    queryKey: ["agents", "street-lookup", debouncedAddress],
    apiPath: `${apiPathAgent}/`,
    params: {
      limit: 10,
      page: 1,
      filter: { street: debouncedAddress },
    },
    staleTime: cacheTTL,
    enabled,
    addLang: false,
  });

  const matched = enabled && matches && matches.length > 0 ? matches[0] : null;

  const isDismissed = dismissedAddress === debouncedAddress;
  const isMatch = !!matched && selectedAgentId === matched.id;
  const showBanner = !!matched && !isMatch && !isDismissed;

  const confirmMatch = () => {
    if (matched) setSelectedAgentId(matched.id);
  };

  const dismissMatch = () => {
    setDismissedAddress(debouncedAddress);
    setSelectedAgentId(null);
  };

  return {
    matched,
    matches: enabled ? (matches ?? []) : [],
    selectedAgentId,
    isMatch,
    showBanner,
    isLoading: enabled && isLoading,
    confirmMatch,
    dismissMatch,
  };
}
