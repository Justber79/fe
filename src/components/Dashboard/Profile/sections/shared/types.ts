export type MatchHandler = () => void | Promise<unknown>;

export type EmailNoteControl = { value: string; onChange: (value: string) => void };

export type AccordionActionProps =
  | {
      onMatch: MatchHandler;
      emailNote: EmailNoteControl;
      onNotAMatch: () => void;
      onMarkAsActive: () => void;
      onMarkAsPast: () => void;
    }
  | { onMatch?: never; emailNote?: never; onNotAMatch?: never; onMarkAsActive?: never; onMarkAsPast?: never };

export type EditableSectionRef = {
  handleEditClick: () => void;
};

export type EditableSectionProps = {
  onEditingChange?: (isEditing: boolean) => void;
};
