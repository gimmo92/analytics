import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { labels } from "../../labels";
import type { HistogramData } from "../../types";
import { binMidpoint, ratingToColor } from "../../utils/histogram";
import styles from "./RatingHistogramChart.module.css";

interface RatingHistogramChartProps {
  data: HistogramData;
}

interface ChartRow {
  binMid: number;
  binLabel: string;
  count: number;
  percentage: number;
  binStart: number;
  binEnd: number;
  fill: string;
}

function HistogramTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  const L = labels.charts.histogram;

  return (
    <div className={styles.tooltip} role="tooltip">
      <p className={styles.tooltipTitle}>{row.binLabel}</p>
      <p>
        {L.tooltipCount}: <strong>{row.count}</strong>
      </p>
      <p>
        {L.tooltipPercent}: <strong>{row.percentage.toFixed(1)}%</strong>
      </p>
      <p>
        {L.tooltipRange}: {row.binStart.toFixed(2)} – {row.binEnd.toFixed(2)}
      </p>
    </div>
  );
}

function PercentLabel(props: {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}) {
  const { x = 0, y = 0, width = 0, value = 0 } = props;
  if (value <= 0) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      className={styles.barLabel}
    >
      {`${value.toFixed(0)}%`}
    </text>
  );
}

export function RatingHistogramChart({ data }: RatingHistogramChartProps) {
  const L = labels.charts.histogram;

  const chartData: ChartRow[] = data.bins.map((bin) => ({
    binMid: binMidpoint(bin),
    binLabel: bin.binLabel,
    count: bin.count,
    percentage: bin.percentage,
    binStart: bin.binStart,
    binEnd: bin.binEnd,
    fill: ratingToColor(binMidpoint(bin)),
  }));

  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label={`${L.ariaLabel}. Media: ${data.mean.toFixed(2)}, campione: ${data.total}`}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="binMid"
            domain={[1, 5]}
            ticks={[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            label={{
              value: L.xAxis,
              position: "insideBottom",
              offset: -4,
              style: { fill: "var(--color-text-secondary)", fontSize: 12 },
            }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            label={{
              value: L.yAxis,
              angle: -90,
              position: "insideLeft",
              style: { fill: "var(--color-text-secondary)", fontSize: 12 },
            }}
          />
          <Tooltip
            content={<HistogramTooltip />}
            cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
          />
          <ReferenceLine
            x={data.mean}
            stroke="var(--color-mean-line)"
            strokeDasharray="6 4"
            strokeWidth={2}
            label={{
              value: `${L.meanLine}: ${data.mean.toFixed(2)}`,
              position: "insideTopRight",
              fill: "var(--color-mean-line)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {chartData.map((entry) => (
              <Cell key={entry.binLabel} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="percentage"
              content={<PercentLabel />}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
