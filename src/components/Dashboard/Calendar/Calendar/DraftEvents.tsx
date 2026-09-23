import { Heading3 } from "@/components/styled/text";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { EventDateGroups } from "./EventDateGroups";
import { SectionHeading } from "./styles";

interface Props {
  events: ApiEventN4DGetList[];
  selectedDateKey: string | null;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
  onPublicationChange: (event: ApiEventN4DGetList) => void;
}

export function DraftEvents({ events, selectedDateKey, onEdit, onDelete, onPublicationChange }: Props) {
  const { t } = useTranslation();

  if (!events.length) return null;

  return (
    <section>
      <SectionHeading>
        <Heading3>{t("dashboard.calendar.draftEvents")}</Heading3>
      </SectionHeading>
      <EventDateGroups
        events={events}
        section="draft"
        selectedDateKey={selectedDateKey}
        onEdit={onEdit}
        onDelete={onDelete}
        onPublicationChange={onPublicationChange}
      />
    </section>
  );
}
