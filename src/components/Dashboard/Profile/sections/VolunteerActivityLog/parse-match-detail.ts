export type MatchDetail =
  | { kind: "linked"; title: string; status?: string; imported: boolean }
  | { kind: "removed"; title: string; from: string }
  | { kind: "statusChanged"; title: string; from?: string; to: string };

const STATUS = "(opp-[a-z-]+)";
const LINKED = new RegExp(`^Linked to opportunity "(.*)"(?: as ${STATUS})?( \\(imported\\))?\\.$`, "s");
const REMOVED = new RegExp(`^Removed from opportunity "(.*)" \\(was ${STATUS}\\)\\.$`, "s");
const STATUS_CHANGED = new RegExp(`^Opportunity "(.*)" status changed(?: from ${STATUS})? to ${STATUS}\\.$`, "s");

export function parseMatchDetail(detail: string): MatchDetail | null {
  const linked = LINKED.exec(detail);
  if (linked) {
    const [, title, status, imported] = linked;
    return { kind: "linked", title, status, imported: Boolean(imported) };
  }

  const removed = REMOVED.exec(detail);
  if (removed) {
    const [, title, from] = removed;
    return { kind: "removed", title, from };
  }

  const statusChanged = STATUS_CHANGED.exec(detail);
  if (statusChanged) {
    const [, title, from, to] = statusChanged;
    return { kind: "statusChanged", title, from, to };
  }

  return null;
}
