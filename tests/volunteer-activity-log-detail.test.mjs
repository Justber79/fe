import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import i18next from "i18next";
import { OpportunityVolunteerStatusType as Status, VolunteerAuditLogType } from "need4deed-sdk";

const packageRequire = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, "..");
const dir = "src/components/Dashboard/Profile/sections/VolunteerActivityLog";

function loadModule(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(root, dir, file), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (id) => dependencies[id] ?? packageRequire(id);
  new Function("require", "module", "exports", output)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const parser = loadModule("parse-match-detail.ts");
const { parseMatchDetail } = parser;
const { formatActivityDetail } = loadModule("format-activity-detail.ts", { "./parse-match-detail": parser });

const translations = (lng) =>
  JSON.parse(fs.readFileSync(path.join(root, "public/locales", lng, "translations.json"), "utf8"));

const i18n = i18next.createInstance();
await i18n.init({
  resources: { en: { translation: translations("en") }, de: { translation: translations("de") } },
  lng: "en",
  interpolation: { escapeValue: false },
  showSupportNotice: false,
});

const matchEntry = (detail) => ({ type: VolunteerAuditLogType.OPPORTUNITY_STATUS_CHANGED, detail });

test("parses Linked with and without status and imported marker", () => {
  assert.deepEqual(parseMatchDetail('Linked to opportunity "Kleiderkammer" as opp-matched.'), {
    kind: "linked",
    title: "Kleiderkammer",
    status: Status.MATCHED,
    imported: false,
  });
  assert.deepEqual(parseMatchDetail('Linked to opportunity "Kleiderkammer".'), {
    kind: "linked",
    title: "Kleiderkammer",
    status: undefined,
    imported: false,
  });
  assert.deepEqual(parseMatchDetail('Linked to opportunity "X" as opp-active (imported).'), {
    kind: "linked",
    title: "X",
    status: Status.ACTIVE,
    imported: true,
  });
  assert.deepEqual(parseMatchDetail('Linked to opportunity "X" (imported).'), {
    kind: "linked",
    title: "X",
    status: undefined,
    imported: true,
  });
});

test("parses Removed and status changes with and without from", () => {
  assert.deepEqual(parseMatchDetail('Removed from opportunity "X" (was opp-past).'), {
    kind: "removed",
    title: "X",
    from: Status.PAST,
  });
  assert.deepEqual(parseMatchDetail('Opportunity "X" status changed from opp-pending to opp-matched.'), {
    kind: "statusChanged",
    title: "X",
    from: Status.PENDING,
    to: Status.MATCHED,
  });
  assert.deepEqual(parseMatchDetail('Opportunity "X" status changed to opp-active.'), {
    kind: "statusChanged",
    title: "X",
    from: undefined,
    to: Status.ACTIVE,
  });
});

test("keeps quotes and line breaks inside titles", () => {
  assert.equal(parseMatchDetail('Linked to opportunity "Foo\nBar" as opp-pending.').title, "Foo\nBar");
  assert.equal(parseMatchDetail('Linked to opportunity "Café "Am Park"" as opp-pending.').title, 'Café "Am Park"');
  assert.equal(parseMatchDetail('Opportunity "say "hi" to" status changed to opp-past.').title, 'say "hi" to');
});

test("accepts unknown opp-* statuses", () => {
  assert.deepEqual(parseMatchDetail('Linked to opportunity "X" as opp-on-hold.'), {
    kind: "linked",
    title: "X",
    status: "opp-on-hold",
    imported: false,
  });
});

test("returns null for non-opp statuses and other sentences", () => {
  for (const detail of [
    'Linked to opportunity "X" as matched.',
    'Removed from opportunity "X" (was matched).',
    'Opportunity "X" status changed from opp-pending to done.',
    'Linked to opportunity "X" as opp-matched',
    "Phone number changed.",
    "",
  ]) {
    assert.equal(parseMatchDetail(detail), null, detail);
  }
});

test("formats match entries in en and de with status labels", () => {
  const cases = [
    [
      'Linked to opportunity "Kleiderkammer & Co" as opp-pending.',
      'Linked to "Kleiderkammer & Co" as Pending',
      "Verknüpft mit „Kleiderkammer & Co“ als Angefragt",
    ],
    ['Linked to opportunity "X".', 'Linked to "X"', "Verknüpft mit „X“"],
    [
      'Linked to opportunity "X" as opp-matched (imported).',
      'Linked to "X" as Matched (imported, date approximate)',
      "Verknüpft mit „X“ als Zugeordnet (importiert, Datum ungefähr)",
    ],
    ['Removed from opportunity "X" (was opp-past).', 'Removed from "X" (was Past)', "Entfernt aus „X“ (war Vergangen)"],
    [
      'Opportunity "X" status changed from opp-matched to opp-active.',
      '"X": Matched → Active',
      "„X“: Zugeordnet → Aktiv",
    ],
    ['Opportunity "X" status changed to opp-active.', '"X": status changed to Active', "„X“: Status geändert zu Aktiv"],
  ];
  for (const [detail, en, de] of cases) {
    assert.equal(formatActivityDetail(matchEntry(detail), i18n.getFixedT("en")), en);
    assert.equal(formatActivityDetail(matchEntry(detail), i18n.getFixedT("de")), de);
  }
});

test("shows the raw detail for other entry types and unparsed sentences", () => {
  const t = i18n.getFixedT("en");
  assert.equal(
    formatActivityDetail(
      { type: VolunteerAuditLogType.CONTACT_DETAILS_CHANGED, detail: 'Linked to opportunity "X".' },
      t,
    ),
    'Linked to opportunity "X".',
  );
  assert.equal(
    formatActivityDetail(matchEntry('Linked to opportunity "X" as matched.'), t),
    'Linked to opportunity "X" as matched.',
  );
});

test("an unknown opp-* status keeps the sentence translated and shows the raw id", () => {
  assert.equal(
    formatActivityDetail(
      matchEntry('Opportunity "X" status changed from opp-matched to opp-on-hold.'),
      i18n.getFixedT("de"),
    ),
    "„X“: Zugeordnet → opp-on-hold",
  );
});

test("every match key exists in en and de", () => {
  for (const lng of ["en", "de"]) {
    const keys = translations(lng).dashboard.volunteerActivityLog;
    for (const key of [
      "emptyState",
      "linked",
      "linkedAs",
      "removed",
      "statusChanged",
      "statusChangedFrom",
      "imported",
    ]) {
      assert.ok(keys[key], `${lng}: dashboard.volunteerActivityLog.${key}`);
    }
    for (const status of Object.values(Status)) {
      assert.ok(translations(lng).dashboard.volunteerProfile.opportunitiesSec.tabs[status], `${lng}: ${status}`);
    }
  }
});
