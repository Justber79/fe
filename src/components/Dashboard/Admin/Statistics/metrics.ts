import { StatisticsGranularity, StatisticsGroupBy, StatisticsMetric } from "need4deed-sdk";

export interface MetricOption {
  metric: StatisticsMetric;
  labelKey: string;
  allTimeTotalsBy?: StatisticsGroupBy;
}

export const METRIC_OPTIONS: MetricOption[] = [
  { metric: StatisticsMetric.NEW_VOLUNTEERS, labelKey: "dashboard.admin.stats.metric.newVolunteers" },
  { metric: StatisticsMetric.REQUESTS, labelKey: "dashboard.admin.stats.metric.requests" },
  {
    metric: StatisticsMetric.LEAD_FROM,
    labelKey: "dashboard.admin.stats.metric.leadFrom",
    allTimeTotalsBy: StatisticsGroupBy.LEAD_FROM,
  },
];

export const GRANULARITY_LABEL_KEYS: Record<StatisticsGranularity, string> = {
  [StatisticsGranularity.MONTH]: "dashboard.admin.stats.granularity.month",
  [StatisticsGranularity.QUARTER]: "dashboard.admin.stats.granularity.quarter",
  [StatisticsGranularity.YEAR]: "dashboard.admin.stats.granularity.year",
};

export const GROUP_BY_LABEL_KEYS: Record<StatisticsGroupBy, string> = {
  [StatisticsGroupBy.NONE]: "dashboard.admin.stats.groupBy.none",
  [StatisticsGroupBy.DISTRICT]: "dashboard.admin.stats.groupBy.district",
  [StatisticsGroupBy.OPPORTUNITY_TYPE]: "dashboard.admin.stats.groupBy.opportunityType",
  [StatisticsGroupBy.VOLUNTEER_TYPE]: "dashboard.admin.stats.groupBy.volunteerType",
  [StatisticsGroupBy.LEAD_FROM]: "dashboard.admin.stats.groupBy.leadFrom",
};

export const STATISTICS_MIN_YEAR = 2020;
