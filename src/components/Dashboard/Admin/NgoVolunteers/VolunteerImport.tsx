"use client";

import { Button } from "@/components/core/button";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@/components/core/common/Table";
import { Heading4, Paragraph } from "@/components/styled/text";
import { useImportVolunteers } from "@/hooks/useImportVolunteers";
import { parseVolunteerCsv } from "@/utils/parseVolunteerCsv";
import { ApiVolunteerImportResult, ApiVolunteerImportRow, VOLUNTEER_IMPORT_MAX_ROWS } from "need4deed-sdk";
import { TFunction } from "i18next";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "./styles";

const i18nPrefix = "dashboard.admin.ngoVolunteers.import";

const ROW_ERROR_KEYS: [RegExp, string][] = [
  [/^firstName is required$/, "firstName"],
  [/^email is not a valid address$/, "email"],
  [/^postcode .* is unknown$/, "postcode"],
  [/^email belongs to a registered account$/, "registered"],
  [/^email belongs to an existing person with another name$/, "otherPerson"],
];

const translateRowError = (error: string, t: TFunction) => {
  const key = ROW_ERROR_KEYS.find(([pattern]) => pattern.test(error))?.[1];
  return key ? t(`${i18nPrefix}.rowErrors.${key}`) : error;
};

type LoadedFile = { rows: ApiVolunteerImportRow[]; lines: number[] };

export function VolunteerImport({ agentId }: { agentId: number }) {
  const { t } = useTranslation();
  const [file, setFile] = useState<LoadedFile>();
  const [fileError, setFileError] = useState<string>();
  const [report, setReport] = useState<ApiVolunteerImportResult>();
  const [reportLines, setReportLines] = useState<number[]>([]);
  const version = useRef(0);
  const reportVersion = useRef(0);

  const { mutate: runImport, isPending } = useImportVolunteers(agentId, (result) => {
    if (reportVersion.current !== version.current) return;
    setReport(result);
    if (!result.dryRun && result.invalid === 0) setFile(undefined);
  });

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const current = ++version.current;
    const input = event.target;
    setFile(undefined);
    setReport(undefined);
    setFileError(undefined);
    const picked = input.files?.[0];
    if (!picked) return;
    const text = await picked.text();
    input.value = "";
    if (current !== version.current) return;

    const parsed = parseVolunteerCsv(text);
    if (parsed.status === "empty") {
      setFileError(t(`${i18nPrefix}.empty`));
    } else if (parsed.status === "missing-columns") {
      setFileError(t(`${i18nPrefix}.missingColumns`, { columns: parsed.columns.join(", ") }));
    } else if (parsed.status === "duplicate-columns") {
      setFileError(t(`${i18nPrefix}.duplicateColumns`, { columns: parsed.columns.join(", ") }));
    } else if (parsed.rows.length > VOLUNTEER_IMPORT_MAX_ROWS) {
      setFileError(t(`${i18nPrefix}.tooMany`, { max: VOLUNTEER_IMPORT_MAX_ROWS }));
    } else {
      setFile({ rows: parsed.rows, lines: parsed.lines });
    }
  };

  const submit = (dryRun: boolean) => {
    if (!file) return;
    reportVersion.current = version.current;
    setReportLines(file.lines);
    runImport(dryRun ? { rows: file.rows, dryRun } : { rows: file.rows });
  };

  const canImport = Boolean(file) && report?.dryRun === true && report.invalid === 0 && report.created > 0;

  return (
    <Section>
      <Heading4 margin={0}>{t(`${i18nPrefix}.title`)}</Heading4>
      <Paragraph>{t(`${i18nPrefix}.helper`)}</Paragraph>
      <input type="file" accept=".csv,text/csv" aria-label={t(`${i18nPrefix}.file`)} onChange={handleFile} />
      {fileError && <Paragraph color="var(--color-red-600)">{fileError}</Paragraph>}
      {file && <Paragraph>{t(`${i18nPrefix}.rowsLoaded`, { count: file.rows.length })}</Paragraph>}
      {file && (
        <Button text={t(`${i18nPrefix}.preview`)} width="auto" disabled={isPending} onClick={() => submit(true)} />
      )}
      {canImport && (
        <Button text={t(`${i18nPrefix}.import`)} width="auto" disabled={isPending} onClick={() => submit(false)} />
      )}
      {report && <ImportReport report={report} lines={reportLines} />}
    </Section>
  );
}

function ImportReport({ report, lines }: { report: ApiVolunteerImportResult; lines: number[] }) {
  const { t } = useTranslation();
  const summaryKey = report.invalid > 0 && !report.dryRun ? "rejected" : report.dryRun ? "summary" : "imported";

  return (
    <>
      <Paragraph>
        {t(`${i18nPrefix}.${summaryKey}`, {
          created: report.created,
          skipped: report.skipped,
          invalid: report.invalid,
        })}
      </Paragraph>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{t(`${i18nPrefix}.line`)}</TableCell>
              <TableCell>{t(`${i18nPrefix}.email`)}</TableCell>
              <TableCell>{t(`${i18nPrefix}.outcome`)}</TableCell>
              <TableCell>{t(`${i18nPrefix}.details`)}</TableCell>
            </TableRow>
            {report.rows.map((row, index) => (
              <TableRow key={row.row} $isLast={index === report.rows.length - 1}>
                <TableCell>{lines[row.row] ?? "—"}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{t(`${i18nPrefix}.outcomes.${row.outcome}`)}</TableCell>
                <TableCell>
                  {row.skipReason
                    ? t(`${i18nPrefix}.skipReasons.${row.skipReason}`)
                    : (row.errors ?? []).map((error) => translateRowError(error, t)).join("; ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
