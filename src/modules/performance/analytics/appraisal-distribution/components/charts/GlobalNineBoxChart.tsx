import { useState } from "react";
import { labels } from "../../labels";
import type { NineBoxCell, NineBoxData } from "../../types";
import { nineBoxCellColor } from "../../utils/nineBox";
import styles from "./GlobalNineBoxChart.module.css";

interface GlobalNineBoxChartProps {
  data: NineBoxData;
}

interface SelectedCell {
  cell: NineBoxCell;
}

export function GlobalNineBoxChart({ data }: GlobalNineBoxChartProps) {
  const L = labels.charts.nineBox;
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  const rows = [3, 2, 1] as const;

  return (
    <div className={styles.wrap} role="img" aria-label={L.ariaLabel}>
      <p className={styles.summary}>
        {L.total}: <strong>{data.total}</strong>
        <span className={styles.thresholds}>
          {L.perfThresholds}: ≤{data.performanceThresholds.p33.toFixed(2)} / ≤
          {data.performanceThresholds.p66.toFixed(2)} · {L.potThresholds}: ≤
          {data.potentialThresholds.p33.toFixed(2)} / ≤
          {data.potentialThresholds.p66.toFixed(2)}
        </span>
      </p>

      <div className={styles.gridLayout}>
        <div className={styles.yAxis} aria-hidden="true">
          <span className={styles.yHigh}>{L.potentialHigh}</span>
          <span>{L.potentialMid}</span>
          <span className={styles.yLow}>{L.potentialLow}</span>
          <span className={styles.yTitle}>{L.axisPotential}</span>
        </div>

        <div className={styles.gridWrap}>
          <div
            className={styles.grid}
            role="grid"
            aria-label={L.gridLabel}
          >
            {rows.map((potTier) => (
              <div
                key={`row-${potTier}`}
                className={styles.row}
                role="row"
              >
                {([1, 2, 3] as const).map((perfTier) => {
                  const cell = data.cells.find(
                    (c) =>
                      c.performanceTier === perfTier &&
                      c.potentialTier === potTier,
                  );
                  if (!cell) return null;

                  const isSelected =
                    selected?.cell.performanceTier === perfTier &&
                    selected?.cell.potentialTier === potTier;

                  return (
                    <button
                      key={cellKey(perfTier, potTier)}
                      type="button"
                      role="gridcell"
                      className={`${styles.cell} ${isSelected ? styles.cellSelected : ""}`}
                      style={{
                        backgroundColor: nineBoxCellColor(
                          perfTier,
                          potTier,
                          cell.count,
                        ),
                      }}
                      aria-label={`${cell.label}: ${cell.count} ${L.people}, ${cell.percentage.toFixed(0)}%`}
                      onClick={() => setSelected({ cell })}
                    >
                      <span className={styles.cellLabel}>{cell.label}</span>
                      <span className={styles.cellCount}>{cell.count}</span>
                      <span className={styles.cellPct}>
                        {cell.percentage.toFixed(0)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.xAxis} aria-hidden="true">
            <span>{L.performanceLow}</span>
            <span>{L.performanceMid}</span>
            <span>{L.performanceHigh}</span>
          </div>
          <p className={styles.xTitle}>{L.axisPerformance}</p>
        </div>
      </div>

      {selected && (
        <aside className={styles.detail} aria-live="polite">
          <header className={styles.detailHeader}>
            <h3 className={styles.detailTitle}>
              {selected.cell.label}
              <span className={styles.detailMeta}>
                {selected.cell.count} {L.people} ({selected.cell.percentage.toFixed(1)}%)
              </span>
            </h3>
            <button
              type="button"
              className={styles.detailClose}
              onClick={() => setSelected(null)}
            >
              {L.closeDetail}
            </button>
          </header>
          {selected.cell.employees.length === 0 ? (
            <p className={styles.detailEmpty}>{L.noEmployees}</p>
          ) : (
            <ul className={styles.employeeList}>
              {selected.cell.employees.map((emp) => (
                <li key={emp.appraisalId}>
                  <span className={styles.empName}>{emp.employeeName}</span>
                  <span className={styles.empScores}>
                    {L.perfShort} {emp.performance.toFixed(2)} · {L.potShort}{" "}
                    {emp.potential.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </div>
  );
}

function cellKey(perf: number, pot: number): string {
  return `${perf}-${pot}`;
}
