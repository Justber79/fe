"use client";
import { Button } from "@/components/core/button";
import { apiPathAgentMembership } from "@/config/constants";
import { useGetQuery, useMutationQuery } from "@/hooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import axios from "axios";
import { UserRole } from "need4deed-sdk";
import { AgentMembershipStatus, ApiAgentMembership } from "@/components/AgentRegistration/types";
import { useTranslation } from "react-i18next";
import { Actions, Meta, Panel, Row, Title } from "./styled";

const PENDING_KEY = ["agent-memberships", "pending"];

// Admin-fallback surface: joins that didn't pass email-domain match land here as
// PENDING for an ADMIN/COORDINATOR to approve or reject. Renders nothing when the
// queue is empty, so it's a no-op on the Agents page in the common case.
export function PendingMemberships() {
  const { t } = useTranslation();

  // Moderation is COORDINATOR/ADMIN-only on the backend — gate the fetch by role
  // so non-privileged viewers of the Agents page don't trigger a 401 + toast.
  const user = useCurrentUser(true);
  const canModerate = user?.role === UserRole.COORDINATOR || user?.role === UserRole.ADMIN;

  const { data } = useGetQuery<ApiAgentMembership[]>({
    queryKey: PENDING_KEY,
    apiPath: `${apiPathAgentMembership}?status=${AgentMembershipStatus.PENDING}`,
    addLang: false,
    enabled: canModerate,
  });

  const approve = useMutationQuery<number, unknown>({
    mutationFn: (id) =>
      axios.patch(`${apiPathAgentMembership}/${id}`, { status: AgentMembershipStatus.ACTIVE }).then((r) => r.data),
    successMessage: "dashboard.agents.pendingMemberships.approved",
    queryKeyToInvalidate: PENDING_KEY,
  });

  const reject = useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathAgentMembership}/${id}`).then((r) => r.data),
    successMessage: "dashboard.agents.pendingMemberships.rejected",
    queryKeyToInvalidate: PENDING_KEY,
  });

  const memberships = data ?? [];
  if (!canModerate || memberships.length === 0) return null;

  const busy = approve.isPending || reject.isPending;

  return (
    <Panel data-testid="pending-memberships">
      <Title>{t("dashboard.agents.pendingMemberships.title", { count: memberships.length })}</Title>
      {memberships.map((m) => {
        const name = `${m.person?.firstName ?? ""} ${m.person?.lastName ?? ""}`.trim();
        return (
          <Row key={m.id}>
            <Meta>
              <strong>{name || m.person?.email}</strong>
              <span>{t("dashboard.agents.pendingMemberships.requestsToJoin", { org: m.agentTitle })}</span>
              <span>{m.person?.email}</span>
            </Meta>
            <Actions>
              <Button
                text={t("dashboard.agents.pendingMemberships.approve")}
                backgroundcolor="var(--color-aubergine)"
                textColor="var(--color-white)"
                onClick={() => approve.mutate(m.id)}
                disabled={busy}
              />
              <Button
                text={t("dashboard.agents.pendingMemberships.reject")}
                backgroundcolor="var(--color-white)"
                textColor="var(--color-aubergine)"
                border="1px solid var(--color-aubergine)"
                onClick={() => reject.mutate(m.id)}
                disabled={busy}
              />
            </Actions>
          </Row>
        );
      })}
    </Panel>
  );
}
