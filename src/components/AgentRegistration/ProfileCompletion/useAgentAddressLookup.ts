import { apiPathAgentRegister, cacheTTL } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetQuery } from "@/hooks";
import { useState } from "react";

type AgentSearchMatch = { id: number; title: string };

// Powers the self-registration picker: as the user types their street, look up
// existing agents at a matching address so they can JOIN their org instead of
// creating a duplicate. Backed by the token-gated GET /agent/register/search
// (the COORDINATOR-only GET /agent is not available to a registrant).
export function useAgentAddressLookup(
  addressStreet: string,
  addressPostcode: string,
  token: string | null,
  onConfirm?: (matched: AgentSearchMatch) => void,
) {
  const [selectedAgent, setSelectedAgent] = useState<AgentSearchMatch | null>(null);
  const [dismissedAddress, setDismissedAddress] = useState<string | null>(null);
  const debouncedAddress = useDebounce(addressStreet.trim(), 400);
  const debouncedPostcode = useDebounce(addressPostcode.trim(), 400);

  const enabled = debouncedAddress.length >= 3 && !!debouncedPostcode && !!token;

  const { data: matches } = useGetQuery<AgentSearchMatch[]>({
    queryKey: ["agent-register-search", debouncedAddress, debouncedPostcode],
    apiPath: `${apiPathAgentRegister}/search?token=${encodeURIComponent(
      token ?? "",
    )}&street=${encodeURIComponent(debouncedAddress)}&postcode=${encodeURIComponent(debouncedPostcode)}`,
    staleTime: cacheTTL,
    enabled,
    addLang: false,
  });

  const matched = enabled && matches && matches.length > 0 ? matches[0] : null;

  const isDismissed = dismissedAddress === debouncedAddress;
  const isMatch = !!matched && selectedAgent?.id === matched.id;
  const showBanner = !!matched && !isMatch && !isDismissed;

  const confirmMatch = () => {
    if (!matched) return;
    setSelectedAgent(matched);
    onConfirm?.(matched);
  };

  const dismissMatch = () => {
    setDismissedAddress(debouncedAddress);
    setSelectedAgent(null);
  };

  return {
    matched,
    matches: enabled ? (matches ?? []) : [],
    selectedAgent,
    isMatch,
    showBanner,
    confirmMatch,
    dismissMatch,
  };
}
