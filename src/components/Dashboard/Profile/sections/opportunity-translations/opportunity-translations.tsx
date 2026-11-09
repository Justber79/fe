"use client";

import Button from "@/components/core/button/Button/Button";
import { Select } from "@/components/core/common/select";
import { TextArea } from "@/components/core/common/TextArea";
import { ErrorMessage } from "@/components/core/common/ErrorMessage";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { Heading3 } from "@/components/styled/text";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import { useOpportunityTranslations } from "@/hooks/use-opportunity-translations";
import {
  TranslationReset,
  TranslationWrite,
  useOpportunityTranslationActions,
} from "@/hooks/use-opportunity-translation-actions";
import { isAxiosError } from "axios";
import { CaretDownIcon } from "@phosphor-icons/react";
import { ApiFieldTranslationGet, Id, Lang, TranslationOrigin, TranslationStatus } from "need4deed-sdk";
import { useCallback, useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getLocalizedErrorMessage } from "@/utils/apiErrors";
import { SectionEmptyState } from "../shared/styles";
import {
  getRegenerationState,
  getTranslationReviewStatus,
  getTranslationSnapshot,
  hasEditedTranslationChanged,
  type RegenerationFailure,
} from "./helpers";
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
  TextAction,
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
  refresh,
}: {
  fields: ApiFieldTranslationGet[];
  opportunityId: Id;
  loadError: boolean;
  refresh: () => void;
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
  const [editSnapshot, setEditSnapshot] = useState<Record<string, string>>({});
  const [editFields, setEditFields] = useState<ApiFieldTranslationGet[]>([]);
  const [writeFailed, setWriteFailed] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState<TranslationReset[] | null>(null);
  const [resetSnapshot, setResetSnapshot] = useState("");
  const [regenerationFailures, setRegenerationFailures] = useState<RegenerationFailure[]>([]);
  const [originalLanguage, setOriginalLanguage] = useState<Lang>(fields[0]?.originalLanguage ?? Lang.DE);
  const { save, changeLanguage, resetTranslation } = useOpportunityTranslationActions(opportunityId, language);
  const {
    control,
    handleSubmit,
    reset,
    resetField,
    formState: { errors, dirtyFields },
  } = useForm<Draft>();
  const busy = save.isPending || changeLanguage.isPending || resetTranslation.isPending;
  const targetFields = fields.filter((field) => field.originalLanguage !== language);
  const editableFields = targetFields.filter(
    (field) => field.originalLanguage && (field.fieldName === "title" || field.fieldName === "info"),
  );
  const machineWrites = targetFields.flatMap((field): TranslationWrite[] => {
    const value = field.translations[language];
    return (field.fieldName === "title" || field.fieldName === "info") &&
      value?.status === TranslationStatus.DONE &&
      value.origin === TranslationOrigin.MACHINE &&
      value.text
      ? [{ fieldName: field.fieldName, id: value.id, text: value.text, original: field.original }]
      : [];
  });
  const eligibleRegenerationFields = targetFields.flatMap((field): TranslationReset[] => {
    const value = field.translations[language];
    return (field.fieldName === "title" || field.fieldName === "info") &&
      value &&
      value.status !== TranslationStatus.PENDING
      ? [{ fieldName: field.fieldName, id: value.id }]
      : [];
  });
  const hasFailed = targetFields.some((field) => field.translations[language]?.status === TranslationStatus.FAILED);
  const hasPending = targetFields.some((field) => field.translations[language]?.status === TranslationStatus.PENDING);
  const snapshot = getTranslationSnapshot(targetFields, language);
  const { currentFailures, regenerationFields } = getRegenerationState(
    eligibleRegenerationFields,
    regenerationFailures,
    language,
    snapshot,
  );
  const changedBeforeReset = Boolean(resetDialog) && resetSnapshot !== JSON.stringify(snapshot);
  const changedDuringEdit = editing && hasEditedTranslationChanged(editSnapshot, snapshot, dirtyFields);
  const summary = getTranslationReviewStatus(targetFields, language);
  useEffect(() => {
    if (!open || !hasPending || editing || busy || dialog || resetDialog || loadError) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 5000);
    return () => window.clearInterval(interval);
  }, [open, hasPending, editing, busy, dialog, resetDialog, loadError, language, refresh]);
  const startEdit = () => {
    reset({
      title: fields.find((field) => field.fieldName === "title")?.translations[language]?.text ?? "",
      info: fields.find((field) => field.fieldName === "info")?.translations[language]?.text ?? "",
    });
    setEditSnapshot(snapshot);
    setEditFields(structuredClone(editableFields));
    setWriteFailed(false);
    setEditing(true);
  };
  const submit = handleSubmit((draft) => {
    if (changedDuringEdit || loadError) return;
    const writes = editFields.flatMap((field): TranslationWrite[] => {
      const fieldName = field.fieldName;
      if ((fieldName !== "title" && fieldName !== "info") || !dirtyFields[fieldName]) return [];
      return [{ fieldName, id: field.translations[language]?.id, text: draft[fieldName], original: field.original }];
    });
    if (!writes.length) {
      setEditing(false);
      return;
    }
    writeTranslations(writes, false);
  });
  const writeTranslations = (writes: TranslationWrite[], confirming: boolean) => {
    setWriteFailed(false);
    save.mutate(writes, {
      onSuccess: (results) => {
        const failed = results.filter(({ result }) => result.status === "rejected");
        if (!confirming) {
          results.forEach(({ field, result }) => {
            if (result.status === "fulfilled") resetField(field.fieldName, { defaultValue: field.text.trim() });
          });
        }
        if (failed.length) {
          setWriteFailed(true);
          const failure = failed[0].result;
          if (failure.status === "rejected") toast.error(getLocalizedErrorMessage(failure.reason, t));
          return;
        }
        setEditing(false);
        toast.success(t(confirming ? "opportunityTranslations.confirmed" : "opportunityTranslations.saved"));
      },
    });
  };
  const closeResetDialog = useCallback(() => {
    if (!resetTranslation.isPending) setResetDialog(null);
  }, [resetTranslation.isPending]);
  const closeDialog = useCallback(() => {
    if (!changeLanguage.isPending) setDialog(false);
  }, [changeLanguage.isPending]);

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
          {!open && summary !== "ready" && summary !== "reviewed" && (
            <Status $attention={hasFailed || hasPending} role="status">
              {t(`opportunityTranslations.reviewStatus.${summary}`)}
            </Status>
          )}
        </div>
        <ReviewButton
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-content`}
          disabled={busy || editing}
          onClick={() => setOpen(!open)}
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
          ) : null}
          <form onSubmit={submit} aria-busy={busy}>
            <Comparison>
              <section aria-labelledby={`${id}-original`}>
                <Heading3 id={`${id}-original`}>
                  {t("opportunityTranslations.original")}
                  {fields[0]?.originalLanguage &&
                    ` · ${t(`opportunityTranslations.languages.${fields[0].originalLanguage}`)}`}
                </Heading3>
                {fields.map((field) => (
                  <Field key={field.fieldName}>
                    <h4>{t(`opportunityTranslations.fields.${field.fieldName}`, { defaultValue: field.fieldName })}</h4>
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
                          {value?.status === TranslationStatus.FAILED && (
                            <Metadata role="status">{t("opportunityTranslations.reviewStatus.failed")}</Metadata>
                          )}
                          {value?.status === TranslationStatus.PENDING && (
                            <Metadata role="status">{t("opportunityTranslations.reviewStatus.pending")}</Metadata>
                          )}
                          {!canEdit &&
                            ((value?.status === TranslationStatus.DONE || value?.status === TranslationStatus.FAILED) &&
                            value.text ? (
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
                {writeFailed && <Metadata role="alert">{t("opportunityTranslations.writeFailed")}</Metadata>}
                {!editing &&
                  currentFailures.map(({ fieldName, id, reason, retryLimitReached }) => (
                    <Metadata key={id} role="alert">
                      {t("opportunityTranslations.regenerateFieldFailed", {
                        field: t(`opportunityTranslations.fields.${fieldName}`),
                        reason: retryLimitReached
                          ? t("opportunityTranslations.retryLimitReached")
                          : getLocalizedErrorMessage(reason, t),
                      })}
                    </Metadata>
                  ))}
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
                      {machineWrites.length > 0 && (
                        <Button
                          {...actionProps}
                          text={t("opportunityTranslations.confirm")}
                          disabled={busy || loadError}
                          onClick={() => writeTranslations(machineWrites, true)}
                        />
                      )}
                    </>
                  )}
                </Actions>
                {!editing && regenerationFields.length > 0 && (
                  <TextAction
                    type="button"
                    disabled={busy || loadError}
                    onClick={() => {
                      setResetSnapshot(JSON.stringify(snapshot));
                      setResetDialog(regenerationFields);
                    }}
                  >
                    {t("opportunityTranslations.regenerate")}
                  </TextAction>
                )}
              </section>
            </Comparison>
          </form>
          <Footer>
            <Metadata>
              {t("opportunityTranslations.originalLanguage")}:{" "}
              {fields[0]?.originalLanguage
                ? t(`opportunityTranslations.languages.${fields[0].originalLanguage}`)
                : t("opportunityTranslations.unknownLanguage")}
            </Metadata>
            <TextAction
              type="button"
              disabled={editing || busy || loadError}
              onClick={() => {
                setOriginalLanguage(fields[0]?.originalLanguage ?? Lang.DE);
                setDialog(true);
              }}
            >
              {t("opportunityTranslations.changeOriginal")}
            </TextAction>
          </Footer>
        </Expanded>
      )}
      {resetDialog && (
        <ConfirmationDialog
          title={t("opportunityTranslations.regenerateTitle")}
          message={t("opportunityTranslations.regenerateBody", {
            language: t(`opportunityTranslations.languages.${language}`),
            fields: resetDialog.map(({ fieldName }) => t(`opportunityTranslations.fields.${fieldName}`)).join(", "),
          })}
          cancelText={t("opportunityTranslations.cancel")}
          confirmText={t("opportunityTranslations.regenerate")}
          onCancel={closeResetDialog}
          cancelDisabled={resetTranslation.isPending}
          confirmDisabled={busy || loadError || changedBeforeReset}
          onConfirm={() => {
            if (busy || loadError || changedBeforeReset) return;
            resetTranslation.mutate(resetDialog, {
              onSuccess: (results) => {
                const failures = results.flatMap(({ field, result }): RegenerationFailure[] =>
                  result.status === "rejected"
                    ? [
                        {
                          ...field,
                          language,
                          snapshot: snapshot[field.fieldName],
                          reason: result.reason,
                          retryLimitReached: isAxiosError(result.reason) && result.reason.response?.status === 409,
                        },
                      ]
                    : [],
                );
                setRegenerationFailures((previous) => [
                  ...previous.filter(
                    (failure) =>
                      failure.language !== language ||
                      (currentFailures.includes(failure) && !results.some(({ field }) => field.id === failure.id)),
                  ),
                  ...failures,
                ]);
                setResetDialog(null);
                if (!failures.length) toast.success(t("opportunityTranslations.regenerateRequested"));
              },
            });
          }}
        >
          {changedBeforeReset && (
            <Metadata role="alert">{t("opportunityTranslations.changedBeforeRegeneration")}</Metadata>
          )}
        </ConfirmationDialog>
      )}
      {dialog && (
        <ConfirmationDialog
          title={t("opportunityTranslations.dialogTitle")}
          message={`${t("opportunityTranslations.dialogBody")} ${t("opportunityTranslations.replaceWarning")}`}
          cancelText={t("opportunityTranslations.cancel")}
          confirmText={t("opportunityTranslations.changeOriginal")}
          onCancel={closeDialog}
          cancelDisabled={changeLanguage.isPending}
          confirmDisabled={
            changeLanguage.isPending ||
            loadError ||
            fields.every((field) => field.originalLanguage === originalLanguage)
          }
          onConfirm={() =>
            changeLanguage.mutate(
              { originalLanguage },
              {
                onSuccess: () => {
                  setDialog(false);
                  setEditing(false);
                },
              },
            )
          }
        >
          <div>
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
          </div>
        </ConfirmationDialog>
      )}
    </Review>
  );
}

export function OpportunityTranslations({ opportunityId }: { opportunityId: Id }) {
  const { t } = useTranslation();
  const { isAuthorized } = useAuth();
  const { data, isLoading, isError, refresh } = useOpportunityTranslations(opportunityId, isAuthorized);
  if (!isAuthorized) return null;
  if (isLoading) return <SectionEmptyState role="status">{t("opportunityTranslations.loading")}</SectionEmptyState>;
  if (isError && !data?.length)
    return (
      <Review>
        <SectionEmptyState role="alert">
          <Metadata>{t("opportunityTranslations.error")}</Metadata>
          <ReviewButton type="button" onClick={refresh}>
            {t("opportunityTranslations.retry")}
          </ReviewButton>
        </SectionEmptyState>
      </Review>
    );
  if (!data?.length) return <SectionEmptyState>{t("opportunityTranslations.empty")}</SectionEmptyState>;
  return (
    <TranslationReview
      key={String(opportunityId)}
      fields={data}
      opportunityId={opportunityId}
      loadError={isError}
      refresh={refresh}
    />
  );
}
