import { ApiVolunteerImportRow } from "need4deed-sdk";

export type VolunteerCsvResult =
  | { status: "ok"; rows: ApiVolunteerImportRow[]; lines: number[] }
  | { status: "missing-columns"; columns: string[] }
  | { status: "duplicate-columns"; columns: string[] }
  | { status: "empty" };

const COLUMNS: Record<string, keyof ApiVolunteerImportRow> = {
  firstname: "firstName",
  lastname: "lastName",
  email: "email",
  phone: "phone",
  postcode: "postcode",
};
const REQUIRED: (keyof ApiVolunteerImportRow)[] = ["firstName", "email", "postcode"];

const normalizeHeader = (header: string) => header.toLowerCase().replace(/[\s_-]/g, "");

type Record_ = { line: number; cells: string[] };

function headerDelimiter(text: string): string {
  let commas = 0;
  let semicolons = 0;
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    else if (!quoted && (char === "\n" || char === "\r")) break;
    else if (!quoted && char === ",") commas++;
    else if (!quoted && char === ";") semicolons++;
  }
  return semicolons > commas ? ";" : ",";
}

function readRecords(text: string, delimiter: string): Record_[] {
  const records: Record_[] = [];
  let cells: string[] = [];
  let cell = "";
  let quoted = false;
  let line = 1;
  let recordLine = 1;

  const endRecord = () => {
    cells.push(cell.trim());
    if (cells.some((value) => value !== "")) {
      records.push({ line: recordLine, cells });
    }
    cells = [];
    cell = "";
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        if (char === "\n") line++;
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      cells.push(cell.trim());
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      endRecord();
      line++;
      recordLine = line;
    } else {
      cell += char;
    }
  }
  endRecord();
  return records;
}

export function parseVolunteerCsv(input: string): VolunteerCsvResult {
  const text = input.replace(/^﻿/, "");
  const [header, ...data] = readRecords(text, headerDelimiter(text));
  if (!header || data.length === 0) {
    return { status: "empty" };
  }
  const fields = header.cells.map((name) => COLUMNS[normalizeHeader(name)]);
  const duplicates = fields.filter((field, index) => field && fields.indexOf(field) !== index);
  if (duplicates.length > 0) {
    return { status: "duplicate-columns", columns: Array.from(new Set(duplicates)) as string[] };
  }
  const missing = REQUIRED.filter((field) => !fields.includes(field));
  if (missing.length > 0) {
    return { status: "missing-columns", columns: missing };
  }
  const rows = data.map(({ cells }) => {
    const row: Partial<ApiVolunteerImportRow> = {};
    fields.forEach((field, index) => {
      if (field && cells[index]) {
        row[field] = cells[index];
      }
    });
    return { firstName: "", email: "", postcode: "", ...row } as ApiVolunteerImportRow;
  });
  return { status: "ok", rows, lines: data.map(({ line }) => line) };
}
