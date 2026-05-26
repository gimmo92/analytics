import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Customized,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { labels } from "../../labels";
import type { DepartmentBoxplotData, DepartmentBoxplotItem } from "../../types";
import {
  sortBoxplotDepartments,
  type BoxplotSortMode,
} from "../../utils/boxplot";
import styles from "./DepartmentBoxplotChart.module.css";

interface DepartmentBoxplotChartProps {
  data: DepartmentBoxplotData;
}

interface ChartRow extends DepartmentBoxplotItem {
  name: string;
}

interface RechartsLayerProps {
  xAxisMap?: Record<
    string,
    {
      scale: ((v: string) => number) & { bandwidth?: () => number };
    }
  >;
  yAxisMap?: Record<string, { scale: (v: number) => number }>;
  offset?: { top: number; left: number; width: number; height: number };
}

function BoxPlotLayer({
  departments,
  xAxisMap,
  yAxisMap,
  offset,
}: RechartsLayerProps & { departments: DepartmentBoxplotItem[] }) {
  if (!xAxisMap || !yAxisMap || !offset) return null;

  const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
  const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
  const bandwidth = xAxis.scale.bandwidth?.() ?? 48;
  const boxWidth = Math.min(36, bandwidth * 0.55);
  const yScale = yAxis.scale;

  return (
    <g>
      {departments.map((d) => {
        const cx =
          xAxis.scale(d.departmentName) + bandwidth / 2 + offset.left;
        const yQ1 = yScale(d.q1) + offset.top;
        const yQ3 = yScale(d.q3) + offset.top;
        const yMed = yScale(d.median) + offset.top;
        const yMin = yScale(d.min) + offset.top;
        const yMax = yScale(d.max) + offset.top;
        const boxTop = Math.min(yQ1, yQ3);
        const boxHeight = Math.abs(yQ3 - yQ1);

        return (
          <g key={d.departmentId}>
            <line
              x1={cx}
              x2={cx}
              y1={yMin}
              y2={boxTop}
              stroke="var(--color-text-secondary)"
              strokeWidth={1.5}
            />
            <line
              x1={cx}
              x2={cx}
              y1={boxTop + boxHeight}
              y2={yMax}
              stroke="var(--color-text-secondary)"
              strokeWidth={1.5}
            />
            <line
              x1={cx - boxWidth / 2}
              x2={cx + boxWidth / 2}
              y1={yMin}
              y2={yMin}
              stroke="var(--color-text-secondary)"
              strokeWidth={1.5}
            />
            <line
              x1={cx - boxWidth / 2}
              x2={cx + boxWidth / 2}
              y1={yMax}
              y2={yMax}
              stroke="var(--color-text-secondary)"
              strokeWidth={1.5}
            />
            <rect
              x={cx - boxWidth / 2}
              y={boxTop}
              width={boxWidth}
              height={Math.max(boxHeight, 2)}
              fill="#dbeafe"
              stroke="var(--color-primary)"
              strokeWidth={1.5}
              rx={2}
            />
            <line
              x1={cx - boxWidth / 2}
              x2={cx + boxWidth / 2}
              y1={yMed}
              y2={yMed}
              stroke="var(--color-primary-hover)"
              strokeWidth={2.5}
            />
            {d.outliers.map((o, i) => (
              <circle
                key={`${d.departmentId}-o-${i}`}
                cx={cx}
                cy={yScale(o) + offset.top}
                r={4}
                fill="var(--color-rating-mid)"
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

function BoxplotTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const L = labels.charts.departmentBoxplot;

  return (
    <div className={styles.tooltip} role="tooltip">
      <p className={styles.tooltipTitle}>{d.departmentName}</p>
      <p>
        {L.tooltipMin}: <strong>{d.min.toFixed(2)}</strong>
      </p>
      <p>
        {L.tooltipQ1}: <strong>{d.q1.toFixed(2)}</strong>
      </p>
      <p>
        {L.tooltipMedian}: <strong>{d.median.toFixed(2)}</strong>
      </p>
      <p>
        {L.tooltipQ3}: <strong>{d.q3.toFixed(2)}</strong>
      </p>
      <p>
        {L.tooltipMax}: <strong>{d.max.toFixed(2)}</strong>
      </p>
      <p>
        {L.tooltipOutliers}:{" "}
        <strong>
          {d.outliers.length
            ? d.outliers.map((o) => o.toFixed(2)).join(", ")
            : "—"}
        </strong>
      </p>
      <p>
        {L.tooltipSample}: <strong>{d.sampleSize}</strong>
      </p>
    </div>
  );
}

export function DepartmentBoxplotChart({ data }: DepartmentBoxplotChartProps) {
  const L = labels.charts.departmentBoxplot;
  const [sortMode, setSortMode] = useState<BoxplotSortMode>("medianDesc");

  const sorted = useMemo(
    () => sortBoxplotDepartments(data.departments, sortMode),
    [data.departments, sortMode],
  );

  const chartData: ChartRow[] = sorted.map((d) => ({
    ...d,
    name: d.departmentName,
  }));

  return (
    <div className={styles.wrap} role="img" aria-label={L.ariaLabel}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={
            sortMode === "medianDesc" ? styles.sortActive : styles.sortBtn
          }
          onClick={() => setSortMode("medianDesc")}
        >
          {L.sortMedian}
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
        <ComposedChart
          data={chartData}
          margin={{ top: 16, right: 24, left: 8, bottom: 48 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            horizontal
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            interval={0}
            angle={-25}
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
          <Tooltip content={<BoxplotTooltip />} cursor={false} />
          <Scatter
            data={chartData}
            dataKey="median"
            fill="transparent"
            stroke="transparent"
            isAnimationActive={false}
          />
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
          <Customized
            component={(props: RechartsLayerProps) => (
              <BoxPlotLayer {...props} departments={sorted} />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
