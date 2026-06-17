import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { labels } from "../../labels";
import type { DistributionData, ManagerDistributionSeries } from "../../types";
import styles from "./BellCurveChart.module.css";

interface BellCurveChartProps {
  data: DistributionData;
}

interface CurveRow {
  x: number;
  realDensity: number;
  expectedDensity: number;
  gap: number;
  [seriesKey: string]: number;
}

function CurveTooltip({
  active,
  payload,
  managerSeries,
}: {
  active?: boolean;
  payload?: Array<{ payload: CurveRow; dataKey?: string; name?: string }>;
  managerSeries?: ManagerDistributionSeries[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  const L = labels.charts.bellCurve;

  return (
    <div className={styles.tooltip} role="tooltip">
      <p>
        {L.tooltipRating}: <strong>{row.x.toFixed(2)}</strong>
      </p>
      {managerSeries?.length ? (
        managerSeries.map((series) => (
          <p key={series.managerId}>
            {series.managerName}:{" "}
            <strong>{(row[series.dataKey] ?? 0).toFixed(4)}</strong>
          </p>
        ))
      ) : (
        <>
          <p>
            {L.tooltipReal}: <strong>{row.realDensity.toFixed(4)}</strong>
          </p>
          <p>
            {L.tooltipExpected}:{" "}
            <strong>{row.expectedDensity.toFixed(4)}</strong>
          </p>
          <p>
            {L.tooltipGap}:{" "}
            <strong>
              {row.gap >= 0 ? "+" : ""}
              {row.gap.toFixed(4)}
            </strong>
          </p>
        </>
      )}
      {managerSeries?.length ? (
        <p>
          {L.tooltipExpected}:{" "}
          <strong>{row.expectedDensity.toFixed(4)}</strong>
        </p>
      ) : null}
    </div>
  );
}

export function BellCurveChart({ data }: BellCurveChartProps) {
  const L = labels.charts.bellCurve;
  const deviation = data.meanDeviation;
  const biasUp = deviation > 0;
  const deviationLabel = `${deviation >= 0 ? "+" : ""}${deviation.toFixed(2)}`;
  const showManagerSeries = (data.managerSeries?.length ?? 0) > 0;

  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label={`${L.ariaLabel}. ${L.meanDeviation}: ${deviationLabel}`}
    >
      <div
        className={
          biasUp ? styles.badgeUp : deviation < 0 ? styles.badgeDown : styles.badgeNeutral
        }
        aria-live="polite"
      >
        <span className={styles.badgeLabel}>{L.meanDeviation}:</span>
        <span className={styles.badgeValue}>{deviationLabel}</span>
        <span className={styles.badgeArrow} aria-hidden="true">
          {deviation === 0 ? "•" : biasUp ? "↑" : "↓"}
        </span>
        <span className={styles.badgeHint}>
          {deviation === 0
            ? "—"
            : biasUp
              ? L.biasUp
              : L.biasDown}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data.points}
          margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="x"
            domain={[1, 5]}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            label={{
              value: L.xAxis,
              position: "insideBottom",
              offset: -4,
              style: { fill: "var(--color-text-secondary)", fontSize: 12 },
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            label={{
              value: L.yAxis,
              angle: -90,
              position: "insideLeft",
              style: { fill: "var(--color-text-secondary)", fontSize: 12 },
            }}
          />
          <Tooltip
            content={
              <CurveTooltip managerSeries={data.managerSeries} />
            }
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          />
          {showManagerSeries ? (
            data.managerSeries?.map((series) => (
              <Line
                key={series.managerId}
                type="monotone"
                dataKey={series.dataKey}
                name={series.managerName}
                stroke={series.color}
                strokeWidth={2.5}
                dot={false}
              />
            ))
          ) : (
            <Area
              type="monotone"
              dataKey="realDensity"
              name={L.realSeries}
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.22}
              strokeWidth={2.5}
              dot={false}
            />
          )}
          <Line
            type="monotone"
            dataKey="expectedDensity"
            name={L.expectedSeries}
            stroke="var(--color-text-muted)"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
