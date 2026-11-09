"use client";
import { AgentOption, useAgentSearch } from "@/hooks/useAgentSearch";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog, DialogSearchInput } from "../common";
import { NO_OWNER, UseVolunteerOwnerDialogReturn } from "./useVolunteerOwnerDialog";

const i18nPrefix = "dashboard.volunteerProfile.volunteerHeader.ownerModal";

type Props = {
  dialog: UseVolunteerOwnerDialogReturn;
  currentOwner?: AgentOption;
};

export const ChangeVolunteerOwnerDialog = ({ dialog, currentOwner }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<AgentOption>();
  const { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled } = dialog;

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setPicked(undefined);
    }
  }, [isOpen]);

  const { agents } = useAgentSearch(search, isOpen);

  const pinned = [currentOwner, picked].filter((agent): agent is AgentOption => Boolean(agent));
  const listed = [...pinned, ...agents].filter(
    (agent, index, all) => all.findIndex(({ id }) => id === agent.id) === index,
  );
  const options = [
    { value: NO_OWNER, label: t(`${i18nPrefix}.none`) },
    ...listed.map((agent) => ({ value: agent.id, label: agent.title })),
  ];

  const handleSelect = (id: number) => {
    setPicked(listed.find((agent) => agent.id === id));
    setSelected(id);
  };

  return (
    <ChangeStatusDialog
      testId="change-volunteer-owner-dialog"
      isOpen={isOpen}
      title={t(`${i18nPrefix}.title`)}
      beforeOptions={
        <DialogSearchInput
          type="search"
          value={search}
          placeholder={t(`${i18nPrefix}.search`)}
          onChange={(event) => setSearch(event.target.value)}
        />
      }
      options={options}
      selected={selected}
      onSelect={handleSelect}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="ownerAgentId"
      saveLabel={t(`${i18nPrefix}.save`)}
      cancelLabel={t(`${i18nPrefix}.cancel`)}
    />
  );
};
