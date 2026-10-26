"use client";

import Button from "@/components/core/button/Button/Button";
import { Select } from "@/components/core/common/select";
import { TextArea } from "@/components/core/common/TextArea";
import { ErrorMessage } from "@/components/core/common/ErrorMessage";
import { Modal } from "@/components/core/modal";
import { Heading3 } from "@/components/styled/text";
import { apiPathTranslation, MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useOpportunityTranslationActions } from "@/hooks/use-opportunity-translation-actions";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ApiFieldTranslationGet,
  ApiOpportunityPatch,
  EntityTableName,
  Id,
  Lang,
  TranslationOrigin,
  TranslationStatus,
} from "need4deed-sdk";
import { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import {
  Actions,
  Comparison,
  Expanded,
  Field,
  Footer,
  Metadata,
  Review,
  ReviewButton,
  Status,
  Summary,
} from "./styles";

const actionProps = {
  width: "auto",
  height: "var(--translation-action-height)",
  padding: "var(--translation-action-padding)",
  textFontSize: "var(--translation-action-font-size)",
  textFontWeight: 600,
};
type Draft = { title: string; info: string };

function TranslationReview({
  fields,
  opportunityId,
  loadError,
}: {
  fields: ApiFieldTranslationGet[];
  opportunityId: Id;
  loadError: boolean;
}) {
  const { t } = useTranslation();
  const id = useId();
  const [requestedLanguage, setRequestedLanguage] = useState(Lang.EN);
  const languages = [Lang.EN, Lang.DE].filter((language) =>
    fields.some((field) => field.originalLanguage !== language),
  );
  const language = languages.includes(requestedLanguage) ? requestedLanguage : languages[0];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState("");
  const [dialog, setDialog] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState<Lang>(fields[0]?.originalLanguage ?? Lang.DE);
  const { save, confirm, changeLanguage, refresh } = useOpportunityTranslationActions(opportunityId, language);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<Draft>();
  const busy = save.isPending || confirm.isPending || changeLanguage.isPending;
  const targetFields = fields.filter((field) => field.originalLanguage !== language);
  const editableFields = targetFields.filter(
    (field) => field.originalLanguage && (field.fieldName === "title" || field.fieldName === "info"),
  );
  const machineIds = targetFields.flatMap((field) => {
    const value = field.translations[language];
    return value?.status === TranslationStatus.DONE && value.origin === TranslationOrigin.MACHINE && value.text
      ? [value.id]
      : [];
  });
  const hasFailed = targetFields.some((field) => field.translations[language]?.status === TranslationStatus.FAILED);
  const hasPending = targetFields.some((field) => field.translations[language]?.status === TranslationStatus.PENDING);
  const allHuman =
    targetFields.length > 0 &&
    targetFields.every(
      (field) =>
        field.translations[language]?.origin === TranslationOrigin.HUMAN &&
        field.translations[language]?.status === TranslationStatus.DONE,
    );
  const snapshot = JSON.stringify(targetFields);
  const changedDuringEdit = editing && editSnapshot !== snapshot;
  const missing = targetFields.every((field) => !field.translations[language]);
  const summary = hasFailed ? "failed" : hasPending ? "pending" : missing ? "missing" : allHuman ? "reviewed" : "ready";
  useEffect(() => {
    if (!open || !hasPending || editing || busy || dialog || loadError) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 5000);
    return () => window.clearInterval(interval);
  }, [open, hasPending, editing, busy, dialog, loadError, language, refresh]);
  const startEdit = () => {
    reset({
      title: fields.find((field) => field.fieldName === "title")?.translations[language]?.text ?? "",
      info: fields.find((field) => field.fieldName === "info")?.translations[language]?.text ?? "",
    });
    setEditSnapshot(snapshot);
    setEditing(true);
  };
  const submit = handleSubmit((draft) => {
    if (changedDuringEdit || loadError) return;
    const patch: ApiOpportunityPatch = {};
    if (dirtyFields.title && editableFields.some((field) => field.fieldName === "title")) patch.title = draft.title;
    if (dirtyFields.info && editableFields.some((field) => field.fieldName === "info")) patch.description = draft.info;
    if (!Object.keys(patch).length) {
      setEditing(false);
      return;
    }
    save.mutate(patch, { onSuccess: () => setEditing(false) });
  });
  const closeDialog = () => {
    if (!changeLanguage.isPending) setDialog(false);
  };

  return (
    <Review>
      {loadError && (
        <div role="alert">
          <Metadata>{t("opportunityTranslations.staleError")}</Metadata>
          <ReviewButton type="button" disabled={busy} onClick={refresh}>
            {t("opportunityTranslations.retry")}
          </ReviewButton>
        </div>
      )}
      <Summary>
        <div>
          <Heading3>
            {t("opportunityTranslations.target", { language: t(`opportunityTranslations.languages.${language}`) })}
          </Heading3>
          <Metadata>{t("opportunityTranslations.summary")}</Metadata>
          <Status $attention={hasFailed || hasPending} role="status">
            {t(`opportunityTranslations.reviewStatus.${summary}`)}
          </Status>
        </div>
        <ReviewButton
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-content`}
          disabled={busy}
          onClick={() => {
            setEditing(false);
            setOpen(!open);
          }}
        >
          {t(open ? "opportunityTranslations.close" : "opportunityTranslations.review")}
          <CaretDownIcon size={20} aria-hidden style={{ transform: open ? "rotate(180deg)" : undefined }} />
        </ReviewButton>
      </Summary>
      {open && (
        <Expanded id={`${id}-content`}>
          {languages.length > 1 ? (
            <>
              <label htmlFor={`${id}-language`}>{t("opportunityTranslations.targetLanguage")}</label>{" "}
              <Select
                id={`${id}-language`}
                value={language}
                disabled={editing || busy || loadError}
                onChange={(event) => setRequestedLanguage(event.target.value as Lang)}
              >
                {languages.map((value) => (
                  <option key={value} value={value}>
                    {t(`opportunityTranslations.languages.${value}`)}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <Metadata>
              {t("opportunityTranslations.targetLanguage")}: {t(`opportunityTranslations.languages.${language}`)}
            </Metadata>
          )}
          <Metadata>{t("opportunityTranslations.originalNote")}</Metadata>
          <form onSubmit={submit} aria-busy={busy}>
            <Comparison>
              <section aria-labelledby={`${id}-original`}>
                <Heading3 id={`${id}-original`}>{t("opportunityTranslations.original")}</Heading3>
                {fields.map((field) => (
                  <Field key={field.fieldName}>
                    <h4>{t(`opportunityTranslations.fields.${field.fieldName}`, { defaultValue: field.fieldName })}</h4>
                    <Metadata>
                      {field.originalLanguage
                        ? t(`opportunityTranslations.languages.${field.originalLanguage}`)
                        : t("opportunityTranslations.unknownLanguage")}
                    </Metadata>
                    <p lang={field.originalLanguage}>{field.original}</p>
                  </Field>
                ))}
              </section>
              <section aria-labelledby={`${id}-target`}>
                <Heading3 id={`${id}-target`}>{t(`opportunityTranslations.languages.${language}`)}</Heading3>
                {fields.map((field) => {
                  const value = field.translations[language];
                  const isOriginal = field.originalLanguage === language;
                  const draftKey = field.fieldName === "title" ? "title" : "info";
                  const canEdit = editing && editableFields.includes(field);
                  const label = t(`opportunityTranslations.fields.${field.fieldName}`, {
                    defaultValue: field.fieldName,
                  });
                  return (
                    <Field key={field.fieldName}>
                      {canEdit ? (
                        <>
                          <label htmlFor={`${id}-${draftKey}`}>{label}</label>
                          <Controller
                            name={draftKey}
                            control={control}
                            rules={{
                              validate: (text) => {
                                if (!dirtyFields[draftKey]) return true;
                                if (!text.trim()) return t("opportunityTranslations.required");
                                if (draftKey === "info" && text.length > MAX_DESCRIPTION_LENGTH) {
                                  return t("opportunityTranslations.tooLong", { count: MAX_DESCRIPTION_LENGTH });
                                }
                                return true;
                              },
                            }}
                            render={({ field: { value, onChange, onBlur, name } }) => (
                              <TextArea
                                id={`${id}-${draftKey}`}
                                name={name}
                                value={value ?? ""}
                                onChange={onChange}
                                onBlur={onBlur}
                                lang={language}
                                rows={draftKey === "title" ? 2 : 6}
                                disabled={busy}
                                aria-invalid={Boolean(errors[draftKey])}
                                aria-describedby={errors[draftKey] ? `${id}-${draftKey}-error` : undefined}
                              />
                            )}
                          />
                          {errors[draftKey] && (
                            <div id={`${id}-${draftKey}-error`} role="alert">
                              <ErrorMessage message={errors[draftKey]?.message ?? ""} />
                            </div>
                          )}
                        </>
                      ) : (
                        <h4>{label}</h4>
                      )}
                      {isOriginal ? (
                        <Metadata>{t("opportunityTranslations.sameAsOriginal")}</Metadata>
                      ) : (
                        <>
                          {value && (
                            <Metadata>
                              <Status $attention={value.status !== TranslationStatus.DONE}>
                                {t(`opportunityTranslations.status.${value.status}`)}
                              </Status>
                              {" · "}
                              {t(`opportunityTranslations.origin.${value.origin}`)}
                            </Metadata>
                          )}
                          {!canEdit &&
                            (value?.status === TranslationStatus.DONE && value.text ? (
                              <p lang={language}>{value.text}</p>
                            ) : (
                              <Metadata>
                                {t(
                                  value
                                    ? "opportunityTranslations.originalStillShown"
                                    : "opportunityTranslations.missing",
                                )}
                              </Metadata>
                            ))}
                          {value?.lastErrorCode && (
                            <Metadata>
                              {t(`opportunityTranslations.reasons.${value.lastErrorCode}`, {
                                defaultValue: t("opportunityTranslations.unknownError"),
                              })}
                            </Metadata>
                          )}
                        </>
                      )}
                    </Field>
                  );
                })}
                {changedDuringEdit && (
                  <Metadata role="alert">{t("opportunityTranslations.changedDuringEdit")}</Metadata>
                )}
                <Actions>
                  {editing ? (
                    <>
                      <ReviewButton type="button" disabled={busy} onClick={() => setEditing(false)}>
                        {t("opportunityTranslations.cancel")}
                      </ReviewButton>
                      <Button
                        {...actionProps}
                        text={t("opportunityTranslations.save")}
                        type="submit"
                        disabled={busy || changedDuringEdit || loadError}
                      />
                    </>
                  ) : (
                    <>
                      {editableFields.length > 0 && (
                        <ReviewButton type="button" disabled={busy || loadError} onClick={startEdit}>
                          {t("opportunityTranslations.edit")}
                        </ReviewButton>
                      )}
                      {machineIds.length > 0 && (
                        <Button
                          {...actionProps}
                          text={t("opportunityTranslations.confirm")}
                          disabled={busy || loadError}
                          onClick={() => confirm.mutate(machineIds)}
                        />
                      )}
                    </>
                  )}
                </Actions>
              </section>
            </Comparison>
          </form>
          <Footer>
            <ReviewButton
              type="button"
              disabled={editing || busy || loadError}
              onClick={() => {
                setOriginalLanguage(fields[0]?.originalLanguage ?? Lang.DE);
                setDialog(true);
              }}
            >
              {t("opportunityTranslations.changeOriginal")}
            </ReviewButton>
          </Footer>
        </Expanded>
      )}
      {dialog && (
        <Modal isOpen onClose={closeDialog} closeOnOutsideClick={!changeLanguage.isPending}>
          <Review role="dialog" aria-modal="true" aria-labelledby={`${id}-dialog-title`}>
            <Heading3 id={`${id}-dialog-title`}>{t("opportunityTranslations.dialogTitle")}</Heading3>
            <Metadata>{t("opportunityTranslations.dialogBody")}</Metadata>
            <Metadata>{t("opportunityTranslations.replaceWarning")}</Metadata>
            <label htmlFor={`${id}-original-language`}>{t("opportunityTranslations.originalLanguage")}</label>{" "}
            <Select
              id={`${id}-original-language`}
              value={originalLanguage}
              disabled={changeLanguage.isPending}
              onChange={(event) => setOriginalLanguage(event.target.value as Lang)}
            >
              {[Lang.DE, Lang.EN].map((value) => (
                <option key={value} value={value}>
                  {t(`opportunityTranslations.languages.${value}`)}
                </option>
              ))}
            </Select>
            <Actions>
              <ReviewButton type="button" disabled={changeLanguage.isPending} onClick={closeDialog}>
                {t("opportunityTranslations.cancel")}
              </ReviewButton>
              <Button
                {...actionProps}
                text={t("opportunityTranslations.changeOriginal")}
                disabled={
                  changeLanguage.isPending ||
                  loadError ||
                  fields.every((field) => field.originalLanguage === originalLanguage)
                }
                onClick={() =>
                  changeLanguage.mutate(
                    { language: originalLanguage },
                    {
                      onSuccess: () => {
                        setDialog(false);
                        setEditing(false);
                      },
                    },
                  )
                }
              />
            </Actions>
          </Review>
        </Modal>
      )}
    </Review>
  );
}

export function OpportunityTranslations({ opportunityId }: { opportunityId: Id }) {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { isAuthorized } = useAuth();
  const { data, isLoading, isError } = useGetQuery<ApiFieldTranslationGet[]>({
    queryKey: ["opportunity-translations", String(opportunityId)],
    apiPath: `${apiPathTranslation}/${EntityTableName.OPPORTUNITY}/${opportunityId}`,
    enabled: isAuthorized,
    toastOnError: false,
  });
  if (!isAuthorized) return null;
  if (isLoading) return <SectionEmptyState role="status">{t("opportunityTranslations.loading")}</SectionEmptyState>;
  if (isError && !data?.length)
    return (
      <Review>
        <SectionEmptyState role="alert">
          <Metadata>{t("opportunityTranslations.error")}</Metadata>
          <ReviewButton
            type="button"
            onClick={() =>
              void client.invalidateQueries({ queryKey: ["opportunity-translations", String(opportunityId)] })
            }
          >
            {t("opportunityTranslations.retry")}
          </ReviewButton>
        </SectionEmptyState>
      </Review>
    );
  if (!data?.length) return <SectionEmptyState>{t("opportunityTranslations.empty")}</SectionEmptyState>;
  return (
    <TranslationReview key={String(opportunityId)} fields={data} opportunityId={opportunityId} loadError={isError} />
  );
}
