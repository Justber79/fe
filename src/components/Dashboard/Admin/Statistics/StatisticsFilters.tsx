"use client";

import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { de, enUS } from "date-fns/locale";
import { StatisticsGranularity, StatisticsGroupBy, StatisticsMetric } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { GRANULARITY_LABEL_KEYS, GROUP_BY_LABEL_KEYS, METRIC_OPTIONS, STATISTICS_MIN_YEAR } from "./metrics";
import { Button, CheckButton } from "@/components/core/button";
import { DateRange, Field, FieldLabel, FiltersRow, Select, ToggleGroup } from "./styles";

type Props = {
  metric: StatisticsMetric;
  onMetricChange: (metric: StatisticsMetric) => void;
  granularity: StatisticsGranularity;
  onGranularityChange: (granularity: StatisticsGranularity) => void;
  from?: Date;
  to?: Date;
  onFromChange: (date?: Date) => void;
  onToChange: (date?: Date) => void;
  groupBy: StatisticsGroupBy;
  allowedGroupBy: StatisticsGroupBy[];
  onGroupByChange: (groupBy: StatisticsGroupBy) => void;
};

export function StatisticsFilters({
  metric,
  onMetricChange,
  granularity,
  onGranularityChange,
  from,
  to,
  onFromChange,
  onToChange,
  groupBy,
  allowedGroupBy,
  onGroupByChange,
}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;

  return (
    <FiltersRow>
      <Field>
        <FieldLabel htmlFor="statistics-metric">{t("dashboard.admin.stats.metricLabel")}</FieldLabel>
        <Select
          id="statistics-metric"
          value={metric}
          onChange={(event) => onMetricChange(event.target.value as StatisticsMetric)}
        >
          {METRIC_OPTIONS.map(({ metric: value, labelKey }) => (
            <option key={value} value={value}>
              {t(labelKey)}
            </option>
          ))}
        </Select>
      </Field>

      <Field role="group" aria-labelledby="statistics-granularity">
        <FieldLabel as="span" id="statistics-granularity">
          {t("dashboard.admin.stats.granularityLabel")}
        </FieldLabel>
        <ToggleGroup>
          {Object.values(StatisticsGranularity).map((value) => (
            <CheckButton
              key={value}
              label={t(GRANULARITY_LABEL_KEYS[value])}
              checked={granularity === value}
              onChange={() => onGranularityChange(value)}
              height="40px"
              width="auto"
            />
          ))}
        </ToggleGroup>
      </Field>

      <Field role="group" aria-labelledby="statistics-range">
        <FieldLabel as="span" id="statistics-range">
          {t("dashboard.admin.stats.rangeLabel")}
        </FieldLabel>
        <DateRange>
          <DatePickerWithLabel
            date={from}
            onSelect={onFromChange}
            locale={locale}
            label={t("dashboard.admin.stats.from")}
            minYear={STATISTICS_MIN_YEAR}
          />
          <DatePickerWithLabel
            date={to}
            onSelect={onToChange}
            locale={locale}
            label={t("dashboard.admin.stats.to")}
            minYear={STATISTICS_MIN_YEAR}
          />
          {(from || to) && (
            <Button
              text={t("dashboard.admin.stats.clearRange")}
              onClick={() => {
                onFromChange(undefined);
                onToChange(undefined);
              }}
              backgroundcolor="transparent"
              textColor="var(--color-aubergine)"
              padding="0"
            />
          )}
        </DateRange>
      </Field>

      <Field>
        <FieldLabel htmlFor="statistics-group-by">{t("dashboard.admin.stats.groupByLabel")}</FieldLabel>
        <Select
          id="statistics-group-by"
          value={groupBy}
          disabled={allowedGroupBy.length <= 1}
          onChange={(event) => onGroupByChange(event.target.value as StatisticsGroupBy)}
        >
          {allowedGroupBy.map((value) => (
            <option key={value} value={value}>
              {t(GROUP_BY_LABEL_KEYS[value])}
            </option>
          ))}
        </Select>
      </Field>
    </FiltersRow>
  );
}

export default StatisticsFilters;
