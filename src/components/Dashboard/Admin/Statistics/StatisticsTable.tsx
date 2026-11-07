"use client";

import { useTranslation } from "react-i18next";
import { ChartRow, ChartSeries } from "./helpers";
import { DataTable, TableScroll } from "./styles";

type Props = {
  rows: ChartRow[];
  series: ChartSeries[];
  caption: string;
};

export function StatisticsTable({ rows, series, caption }: Props) {
  const { t } = useTranslation();
  const showSeries = series.length > 1;

  return (
    <TableScroll>
      <DataTable>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{t("dashboard.admin.stats.period")}</th>
            {showSeries &&
              series.map(({ key, label }) => (
                <th key={key} scope="col">
                  {label}
                </th>
              ))}
            <th scope="col">{t("dashboard.admin.stats.total")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ period, label, values, total }) => (
            <tr key={period}>
              <th scope="row">{label}</th>
              {showSeries && series.map(({ key }) => <td key={key}>{values[key]}</td>)}
              <td>{total}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </TableScroll>
  );
}

export default StatisticsTable;
