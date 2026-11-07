import { extractOptionTitle } from "@/components/Dashboard/Profile/sections/OpportunityDetails/formatters";
import {
  addDays,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "date-fns";
import {
  ApiStatisticsGet,
  ApiStatisticsQuery,
  Lang,
  STATISTICS_UNKNOWN_KEY,
  StatisticsGranularity,
  StatisticsGroupBy,
} from "need4deed-sdk";

const SERIES_COLORS = [
  "var(--color-blue-500)",
  "var(--color-papaya)",
  "var(--color-green-500)",
  "var(--color-violet-500)",
  "var(--color-pink-500)",
  "var(--color-green-800)",
  "var(--color-aubergine)",
];
const UNKNOWN_COLOR = "var(--color-grey-500)";
const OTHER_COLOR = "var(--color-grey-400)";

export const OTHER_SERIES_KEY = "other-groups";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface ChartRow {
  period: string;
  label: string;
  total: number;
  values: Record<string, number>;
  topKey?: string;
}

export interface StatisticsChartData {
  series: ChartSeries[];
  rows: ChartRow[];
  isEmpty: boolean;
  hasOverlappingGroups: boolean;
}

export interface AllTimeTotalsRow {
  key: string;
  label: string;
  tracked: number;
  beforeTracking: number;
  total: number;
}

const toIsoDate = (date: Date) => format(date, "yyyy-MM-dd");

const PERIOD_BOUNDS: Record<StatisticsGranularity, [(date: Date) => Date, (date: Date) => Date]> = {
  [StatisticsGranularity.MONTH]: [startOfMonth, endOfMonth],
  [StatisticsGranularity.QUARTER]: [startOfQuarter, endOfQuarter],
  [StatisticsGranularity.YEAR]: [startOfYear, endOfYear],
};

export function toStatisticsQuery(
  granularity: StatisticsGranularity,
  groupBy: StatisticsGroupBy,
  from?: Date,
  to?: Date,
): ApiStatisticsQuery {
  const [startOf, endOf] = PERIOD_BOUNDS[granularity];
  return {
    granularity,
    groupBy,
    from: from && toIsoDate(startOf(from)),
    to: to && toIsoDate(addDays(endOf(to), 1)),
  };
}

export function formatPeriod(period: string, granularity: StatisticsGranularity, lang: Lang): string {
  const [year, part] = period.split("-");
  switch (granularity) {
    case StatisticsGranularity.MONTH:
      return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" }).format(
        new Date(Number(year), Number(part) - 1, 1),
      );
    case StatisticsGranularity.QUARTER:
      return `${part} ${year}`;
    case StatisticsGranularity.YEAR:
      return year;
  }
}

const sumCounts = (statistics: ApiStatisticsGet, key: string) =>
  statistics.periods.reduce((sum, { counts }) => sum + (counts[key] ?? 0), 0);

export function buildChartData(statistics: ApiStatisticsGet, lang: Lang, otherLabel: string): StatisticsChartData {
  const totals = new Map(statistics.groups.map(({ key }) => [key, sumCounts(statistics, key)]));
  const activeGroups = statistics.groups.filter(({ key }) => (totals.get(key) ?? 0) > 0);
  const unknownGroup = activeGroups.find(({ key }) => key === STATISTICS_UNKNOWN_KEY);
  const namedGroups = activeGroups.filter(({ key }) => key !== STATISTICS_UNKNOWN_KEY);

  const capacity = SERIES_COLORS.length;
  const shownKeys = new Set(
    (namedGroups.length <= capacity
      ? namedGroups
      : [...namedGroups].sort((a, b) => (totals.get(b.key) ?? 0) - (totals.get(a.key) ?? 0)).slice(0, capacity - 1)
    ).map(({ key }) => key),
  );
  const foldedKeys = namedGroups.filter(({ key }) => !shownKeys.has(key)).map(({ key }) => key);

  const series: ChartSeries[] = namedGroups
    .filter(({ key }) => shownKeys.has(key))
    .map((group, index) => ({ key: group.key, label: extractOptionTitle(group, lang), color: SERIES_COLORS[index] }));
  if (foldedKeys.length) series.push({ key: OTHER_SERIES_KEY, label: otherLabel, color: OTHER_COLOR });
  if (unknownGroup) {
    series.push({ key: unknownGroup.key, label: extractOptionTitle(unknownGroup, lang), color: UNKNOWN_COLOR });
  }

  const rows = statistics.periods.map(({ period, counts, total }) => {
    const values: Record<string, number> = Object.fromEntries(series.map(({ key }) => [key, counts[key] ?? 0]));
    if (foldedKeys.length) values[OTHER_SERIES_KEY] = foldedKeys.reduce((sum, key) => sum + (counts[key] ?? 0), 0);
    return {
      period,
      label: formatPeriod(period, statistics.granularity, lang),
      total,
      values,
      topKey: series.findLast(({ key }) => values[key] > 0)?.key,
    };
  });

  return {
    series,
    rows,
    isEmpty: statistics.periods.every(({ total }) => total === 0),
    hasOverlappingGroups: statistics.periods.some(
      ({ counts, total }) => Object.values(counts).reduce((sum, count) => sum + count, 0) > total,
    ),
  };
}

export function buildAllTimeTotals(statistics: ApiStatisticsGet, lang: Lang): AllTimeTotalsRow[] {
  const beforeTracking = statistics.totalsBeforeTracking ?? {};
  return statistics.groups
    .map((group) => {
      const tracked = sumCounts(statistics, group.key);
      const before = beforeTracking[group.key] ?? 0;
      return {
        key: group.key,
        label: extractOptionTitle(group, lang),
        tracked,
        beforeTracking: before,
        total: tracked + before,
      };
    })
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total);
}
