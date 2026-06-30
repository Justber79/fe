import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetTaggedComments } from "@/hooks/useGetTaggedComments";
import styled from "styled-components";

const NotificationBadgeContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  align-items: top;
  width: 100%;
  height: 100%;
  bottom: var(--dashboard-notification-badge-container-bottom);
`;

const NotificationCircle = styled.div`
  border-radius: var(--dashboard-notification-circle-border-radius);
  padding: var(--dashboard-notification-circle-padding);
  height: fit-content;
  font-size: var(--dashboard-notification-font-size);
  background-color: var(--dashboard-notification-background-color);
  color: var(--dashboard-notification-text-color);
`;

export function NotificationBadge() {
  const user = useCurrentUser();
  const personId = (user as typeof user & { personId?: number })?.personId ?? -1;

  const { tagComments, isLoading, isError } = useGetTaggedComments(personId);

  const count = tagComments?.length || 0;

  if (isLoading || isError || count === 0) {
    return null;
  }

  return (
    <NotificationBadgeContainer>
      <NotificationCircle>{count}</NotificationCircle>
    </NotificationBadgeContainer>
  );
}
