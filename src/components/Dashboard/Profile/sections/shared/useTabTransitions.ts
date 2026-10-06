import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useEffect, useState } from "react";

export const TAB_STATUS_ORDER: OpportunityVolunteerStatusType[] = [
  OpportunityVolunteerStatusType.PENDING,
  OpportunityVolunteerStatusType.MATCHED,
  OpportunityVolunteerStatusType.ACTIVE,
  OpportunityVolunteerStatusType.PAST,
];

export const ITEM_STATUS_REMOVED = "removed" as const;

type StatusOverride = OpportunityVolunteerStatusType | typeof ITEM_STATUS_REMOVED;

export function useTabTransitions<T extends { id: number; status: OpportunityVolunteerStatusType }>(
  items: T[],
  statusOrder: OpportunityVolunteerStatusType[] = TAB_STATUS_ORDER,
) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, StatusOverride>>({});

  // Clear overrides once server data confirms the transition
  useEffect(() => {
    setStatusOverrides((prev) => {
      if (Object.keys(prev).length === 0) return prev;

      const next: Record<number, StatusOverride> = {};
      let changed = false;

      for (const [idStr, overrideStatus] of Object.entries(prev)) {
        const id = Number(idStr);
        const item = items.find((i) => i.id === id);

        if (item && (overrideStatus === ITEM_STATUS_REMOVED || item.status !== overrideStatus)) {
          // Server hasn't caught up yet — keep the override
          next[id] = overrideStatus;
        } else {
          // Server confirmed the change (or item was removed) — drop override
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [items]);

  const getEffectiveStatus = (item: T): StatusOverride => statusOverrides[item.id] ?? item.status;

  const currentTabStatus = statusOrder[selectedTabIndex];

  const tabCounts = statusOrder.map((status) => items.filter((item) => getEffectiveStatus(item) === status).length);

  const visibleItems = items.filter((item) => getEffectiveStatus(item) === currentTabStatus);

  const setItemStatus = (id: number, status: StatusOverride) =>
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));

  // Puts the item back where the server has it after a failed change, unless a
  // newer action on the same item has replaced that change in the meantime.
  const clearItemStatus = (id: number, expected: StatusOverride) =>
    setStatusOverrides((prev) => {
      if (prev[id] !== expected) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });

  return {
    selectedTabIndex,
    setSelectedTabIndex,
    currentTabStatus,
    tabCounts,
    visibleItems,
    setItemStatus,
    clearItemStatus,
  };
}
