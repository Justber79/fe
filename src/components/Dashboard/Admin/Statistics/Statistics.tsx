"use client";

import { DashboardListLoading } from "@/components/Dashboard/common/DashboardListLoading";
import { Heading4, Paragraph } from "@/components/styled/text";
import { useStatistics } from "@/hooks/useStatistics";
import { Lang, StatisticsGranularity, StatisticsGroupBy, StatisticsMetric } from "need4deed-sdk";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AllTimeTotals } from "./AllTimeTotals";
import { buildChartData, toStatisticsQuery } from "./helpers";
import { GROUP_BY_LABEL_KEYS, METRIC_OPTIONS } from "./metrics";
import { StatisticsChart } from "./StatisticsChart";
import { StatisticsFilters } from "./StatisticsFilters";
import { StatisticsTable } from "./StatisticsTable";
import { Button } from "@/components/core/button";
import { Card, CardHeader, Container, Legend, LegendItem, Note, Swatch } from "./styles";

export function Statistics() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;

  const [metric, setMetric] = useState(METRIC_OPTIONS[0].metric);
  const [granularity, setGranularity] = useState(StatisticsGranularity.MONTH);
  const [groupBy, setGroupBy] = useState(StatisticsGroupBy.NONE);
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [showTable, setShowTable] = useState(false);

  const metricOption = METRIC_OPTIONS.find((option) => option.metric === metric) ?? METRIC_OPTIONS[0];
  const isRangeValid = !from || !to || from <= to;

  const { statistics, isLoading, isError, isRefetching } = useStatistics(
    metric,
    toStatisticsQuery(granularity, groupBy, from, to),
    isRangeValid,
  );

  const otherLabel = t("dashboard.admin.stats.other");
  const chart = useMemo(
    () => (statistics ? buildChartData(statistics, lang, otherLabel) : undefined),
    [statistics, lang, otherLabel],
  );

  const allowedGroupBy = statistics?.metric === metric ? statistics.allowedGroupBy : [StatisticsGroupBy.NONE];
  const title =
    groupBy === StatisticsGroupBy.NONE
      ? t(metricOption.labelKey)
      : t("dashboard.admin.stats.titleBy", {
          metric: t(metricOption.labelKey),
          groupBy: t(GROUP_BY_LABEL_KEYS[groupBy]),
        });

  const handleMetricChange = (value: StatisticsMetric) => {
    setMetric(value);
    setGroupBy(StatisticsGroupBy.NONE);
  };

  return (
    <Container>
      <StatisticsFilters
        metric={metric}
        onMetricChange={handleMetricChange}
        granularity={granularity}
        onGranularityChange={setGranularity}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        groupBy={groupBy}
        allowedGroupBy={allowedGroupBy}
        onGroupByChange={setGroupBy}
      />

      <Card aria-labelledby="statistics-chart-title" aria-busy={isRefetching} $isDimmed={isRefetching}>
        <CardHeader>
          <Heading4 id="statistics-chart-title" margin={0}>
            {title}
          </Heading4>
          {chart && !chart.isEmpty && (
            <Button
              text={t(showTable ? "dashboard.admin.stats.hideTable" : "dashboard.admin.stats.showTable")}
              onClick={() => setShowTable((value) => !value)}
              backgroundcolor="transparent"
              textColor="var(--color-aubergine)"
              padding="0"
              aria-expanded={showTable}
            />
          )}
        </CardHeader>

        {!isRangeValid ? (
          <Paragraph color="var(--color-red-600)" role="alert">
            {t("dashboard.admin.stats.invalidRange")}
          </Paragraph>
        ) : isLoading || (statistics && statistics.metric !== metric) ? (
          <DashboardListLoading />
        ) : isError ? (
          <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.stats.loadError")}</Paragraph>
        ) : !chart || chart.isEmpty ? (
          <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.stats.empty")}</Paragraph>
        ) : (
          <>
            {chart.series.length > 1 && (
              <Legend aria-label={t("dashboard.admin.stats.legend")}>
                {chart.series.map(({ key, label, color }) => (
                  <LegendItem key={key}>
                    <Swatch $color={color} aria-hidden />
                    {label}
                  </LegendItem>
                ))}
              </Legend>
            )}
            <StatisticsChart rows={chart.rows} series={chart.series} ariaLabel={title} />
            {chart.hasOverlappingGroups && <Note>{t("dashboard.admin.stats.overlapNote")}</Note>}
            {showTable && <StatisticsTable rows={chart.rows} series={chart.series} caption={title} />}
          </>
        )}
      </Card>

      {metricOption.allTimeTotalsBy && <AllTimeTotals metric={metric} groupBy={metricOption.allTimeTotalsBy} />}
    </Container>
  );
}

export default Statistics;
