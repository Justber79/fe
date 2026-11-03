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
import { useOpportunityTranslationActions } from "@/hooks/use-opportunity-translation-actions";
import { CaretDownIcon } from "@phosphor-icons/react";
import {
  ApiFieldTranslationGet,
  ApiOpportunityPatch,
  Id,
  Lang,
  TranslationOrigin,
  TranslationStatus,
} from "need4deed-sdk";
import { useCallback, useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SectionEmptyState } from "../shared/styles";
import { getTranslationReviewStatus, getTranslationSnapshot, hasEditedTranslationChanged } from "./helpers";
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
  const [dialog, setDialog] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState<Lang>(fields[0]?.originalLanguage ?? Lang.DE);
  const { save, confirm, changeLanguage } = useOpportunityTranslationActions(opportunityId, language);
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
  const snapshot = getTranslationSnapshot(targetFields, language);
  const changedDuringEdit = editing && hasEditedTranslationChanged(editSnapshot, snapshot, dirtyFields);
  const summary = getTranslationReviewStatus(targetFields, language);
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
          <Metadata>{t("opportunityTranslations.summary")}</Metadata>
          <Status $attention={hasFailed || hasPending} role="status">
            {t(`opportunityTranslations.reviewStatus.${summary}`)}
          </Status>
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
              { language: originalLanguage },
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
