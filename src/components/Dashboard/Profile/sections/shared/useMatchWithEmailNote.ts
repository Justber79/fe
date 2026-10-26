import { isEmailNoteNotSent } from "@/utils/apiErrors";
import { ApiOpportunityVolunteerPatch, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useState } from "react";
import { EmailNoteControl } from "./types";

type UpdateStatus = (payload: ApiOpportunityVolunteerPatch & { m2mId: number }) => Promise<unknown>;
type SetItemStatus = (m2mId: number, status: OpportunityVolunteerStatusType) => void;

export function useMatchWithEmailNote(setItemStatus: SetItemStatus, updateStatus: UpdateStatus) {
  const [emailNotes, setEmailNotes] = useState<Record<number, string>>({});

  const markMatched = (m2mId: number) => {
    setItemStatus(m2mId, OpportunityVolunteerStatusType.MATCHED);
    setEmailNotes((prev) => {
      const next = { ...prev };
      delete next[m2mId];
      return next;
    });
  };

  const match = (m2mId: number) => {
    const emailNote = emailNotes[m2mId] ?? "";
    if (!emailNote.trim()) {
      markMatched(m2mId);
      return updateStatus({ m2mId, status: OpportunityVolunteerStatusType.MATCHED });
    }
    return updateStatus({ m2mId, status: OpportunityVolunteerStatusType.MATCHED, emailNote }).then(
      () => markMatched(m2mId),
      (error) => {
        if (isEmailNoteNotSent(error)) markMatched(m2mId);
        throw error;
      },
    );
  };

  const emailNoteFor = (m2mId: number): EmailNoteControl => ({
    value: emailNotes[m2mId] ?? "",
    onChange: (value) => setEmailNotes((prev) => ({ ...prev, [m2mId]: value })),
  });

  return { match, emailNoteFor };
}
