import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { labels } from "../../labels";
import type { TeamHistogramBar, TeamHistogramData } from "../../types";
import {
  sortTeamHistogramBars,
  type TeamHistogramSortMode,
} from "../../utils/teamHistogram";
import styles from "./TeamComparisonHistogramChart.module.css";

interface TeamComparisonHistogramChartProps {
  data: TeamHistogramData;
}

interface ChartRow extends TeamHistogramBar {
  name: string;
  fill: string;
}

function barColor(diff: number): string {
  if (diff > 0.05) return "var(--color-rating-high)";
  if (diff < -0.05) return "var(--color-rating-low)";
  return "var(--color-primary)";
}

function TeamTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  const L = labels.charts.teamHistogram;

  return (
    <div className={styles.tooltip} role="tooltip">
      <p className={styles.tooltipTitle}>{row.teamName}</p>
      <p>
        {L.tooltipAverage}: <strong>{row.average.toFixed(2)}</strong>
      </p>
      <p>
        {L.tooltipDiff}:{" "}
        <strong>
          {row.diffFromCompanyMean >= 0 ? "+" : ""}
          {row.diffFromCompanyMean.toFixed(2)}
        </strong>
      </p>
      <p>
        {L.tooltipSample}: <strong>{row.sampleSize}</strong>
      </p>
    </div>
  );
}

export function TeamComparisonHistogramChart({
  data,
}: TeamComparisonHistogramChartProps) {
  const L = labels.charts.teamHistogram;
  const [sortMode, setSortMode] = useState<TeamHistogramSortMode>("averageDesc");

  const sorted = useMemo(
    () => sortTeamHistogramBars(data.teams, sortMode),
    [data.teams, sortMode],
  );

  const chartData: ChartRow[] = sorted.map((t) => ({
    ...t,
    name: t.teamName,
    fill: barColor(t.diffFromCompanyMean),
  }));

  return (
    <div className={styles.wrap} role="img" aria-label={L.ariaLabel}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={
            sortMode === "averageDesc" ? styles.sortActive : styles.sortBtn
          }
          onClick={() => setSortMode("averageDesc")}
        >
          {L.sortAverage}
        </button>
        <button
          type="button"
          className={
            sortMode === "alphabetical" ? styles.sortActive : styles.sortBtn
          }
          onClick={() => setSortMode("alphabetical")}
        >
          {L.sortAlpha}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 24, right: 16, left: 0, bottom: 48 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={56}
            label={{
              value: L.xAxis,
              position: "insideBottom",
              offset: -8,
              style: { fill: "var(--color-text-secondary)", fontSize: 12 },
            }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            label={{
              value: L.yAxis,
              angle: -90,
              position: "insideLeft",
              style: { fill: "var(--color-text-secondary)", fontSize: 12 },
            }}
          />
          <Tooltip content={<TeamTooltip />} />
          <ReferenceLine
            y={data.companyMean}
            stroke="var(--color-mean-line)"
            strokeDasharray="6 4"
            strokeWidth={2}
            label={{
              value: `${L.companyMean}: ${data.companyMean.toFixed(2)}`,
              position: "insideTopRight",
              fill: "var(--color-mean-line)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="average" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {chartData.map((entry) => (
              <Cell key={entry.teamId} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
