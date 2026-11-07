"use client";

import { Heading4, Paragraph } from "@/components/styled/text";
import { useStatistics } from "@/hooks/useStatistics";
import { Lang, StatisticsGranularity, StatisticsGroupBy, StatisticsMetric } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { buildAllTimeTotals } from "./helpers";
import { GROUP_BY_LABEL_KEYS } from "./metrics";
import { Card, DataTable, Note, TableScroll } from "./styles";

type Props = {
  metric: StatisticsMetric;
  groupBy: StatisticsGroupBy;
};

export function AllTimeTotals({ metric, groupBy }: Props) {
  const { t, i18n } = useTranslation();
  const { statistics, isLoading, isError } = useStatistics(metric, {
    granularity: StatisticsGranularity.YEAR,
    groupBy,
  });

  const rows = statistics ? buildAllTimeTotals(statistics, i18n.language as Lang) : [];

  return (
    <Card aria-labelledby="statistics-all-time-title">
      <Heading4 id="statistics-all-time-title" margin={0}>
        {t("dashboard.admin.stats.allTime.title")}
      </Heading4>
      {isLoading ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.home.content.loading")}</Paragraph>
      ) : isError ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.stats.loadError")}</Paragraph>
      ) : rows.length === 0 ? (
        <Paragraph color="var(--color-grey-500)">{t("dashboard.admin.stats.empty")}</Paragraph>
      ) : (
        <>
          <TableScroll>
            <DataTable>
              <thead>
                <tr>
                  <th scope="col">{t(GROUP_BY_LABEL_KEYS[groupBy])}</th>
                  <th scope="col">{t("dashboard.admin.stats.allTime.tracked")}</th>
                  <th scope="col">{t("dashboard.admin.stats.allTime.beforeTracking")}</th>
                  <th scope="col">{t("dashboard.admin.stats.total")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ key, label, tracked, beforeTracking, total }) => (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td>{tracked}</td>
                    <td>{beforeTracking}</td>
                    <td>{total}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </TableScroll>
          <Note>{t("dashboard.admin.stats.allTime.beforeTrackingNote")}</Note>
        </>
      )}
    </Card>
  );
}

export default AllTimeTotals;
