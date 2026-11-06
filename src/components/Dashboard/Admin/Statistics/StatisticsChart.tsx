"use client";

import { ChartRow, ChartSeries } from "./helpers";
import { ChartScroll, ChartSvg } from "./styles";

const WIDTH = 640;
const HEIGHT = 320;
const MARGIN = { top: 8, right: 8, bottom: 28, left: 40 };
const MAX_BAR_WIDTH = 24;
const TICK_COUNT = 4;
const MAX_X_LABELS = 12;

function niceStep(max: number): number {
  const raw = Math.max(max, 1) / TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].find((factor) => factor * magnitude >= raw) ?? 10;
  return Math.max(1, step * magnitude);
}

type Props = {
  rows: ChartRow[];
  series: ChartSeries[];
  ariaLabel: string;
};

export function StatisticsChart({ rows, series, ariaLabel }: Props) {
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const plotBottom = MARGIN.top + plotHeight;
  const stackSum = (row: ChartRow) => series.reduce((sum, { key }) => sum + (row.values[key] ?? 0), 0);
  const step = niceStep(Math.max(0, ...rows.map((row) => Math.max(row.total, stackSum(row)))));
  const yMax = step * TICK_COUNT;
  const scale = (value: number) => (value / yMax) * plotHeight;
  const slot = plotWidth / Math.max(rows.length, 1);
  const barWidth = Math.min(MAX_BAR_WIDTH, slot * 0.6);
  const labelEvery = Math.ceil(rows.length / MAX_X_LABELS);

  return (
    <ChartScroll tabIndex={0} role="region" aria-label={ariaLabel}>
      <ChartSvg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        {Array.from({ length: TICK_COUNT + 1 }, (_, index) => {
          const y = plotBottom - scale(index * step);
          return (
            <g key={index}>
              <line className="grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y} y2={y} />
              <text className="axis" x={MARGIN.left - 6} y={y} textAnchor="end" dominantBaseline="middle">
                {index * step}
              </text>
            </g>
          );
        })}
        {rows.map((row, index) => {
          const x = MARGIN.left + index * slot + (slot - barWidth) / 2;
          let stacked = 0;
          return (
            <g key={row.period} className="bar">
              <title>{`${row.label}: ${row.total}`}</title>
              {series.map(({ key, label, color }) => {
                const value = row.values[key] ?? 0;
                if (!value) return null;
                const height = scale(value);
                stacked += height;
                return (
                  <rect
                    key={key}
                    x={x}
                    y={plotBottom - stacked}
                    width={barWidth}
                    height={height}
                    style={{ fill: color }}
                  >
                    <title>{`${row.label} · ${label}: ${value}`}</title>
                  </rect>
                );
              })}
              {index % labelEvery === 0 && (
                <text className="axis" x={x + barWidth / 2} y={plotBottom + 18} textAnchor="middle">
                  {row.label}
                </text>
              )}
            </g>
          );
        })}
        <line className="baseline" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={plotBottom} y2={plotBottom} />
      </ChartSvg>
    </ChartScroll>
  );
}

export default StatisticsChart;
