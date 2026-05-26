import { useMemo, useState } from "react";
import { labels } from "../../labels";
import type { NineBoxData, NineBoxScatterPoint } from "../../types";
import { NINE_BOX_GRID_LINES } from "../../types";
import { avatarColorFromId, getInitials } from "../../utils/initials";
import { quadrantLabelPosition } from "../../utils/nineBox";
import styles from "./GlobalNineBoxChart.module.css";

interface GlobalNineBoxChartProps {
  data: NineBoxData;
}

const AXIS_TICKS = [0, 33, 67, 100];

function EmployeeDot({
  point,
  isSelected,
  onSelect,
}: {
  point: NineBoxScatterPoint;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.dot} ${isSelected ? styles.dotSelected : ""}`}
      style={{
        left: `${point.performancePercent}%`,
        top: `${100 - point.potentialPercent}%`,
      }}
      aria-label={`${point.employeeName}, ${point.quadrantLabel}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <span className={styles.dotTooltip} role="tooltip">
        {point.employeeName}
      </span>
    </button>
  );
}

export function GlobalNineBoxChart({ data }: GlobalNineBoxChartProps) {
  const L = labels.charts.nineBox;
  const [selected, setSelected] = useState<NineBoxScatterPoint | null>(null);

  const legendItems = useMemo(
    () => data.quadrants.filter((q) => q.count > 0).slice(0, 6),
    [data.quadrants],
  );

  return (
    <div className={styles.wrap} role="img" aria-label={L.ariaLabel}>
      <p className={styles.summary}>
        {L.total}: <strong>{data.total}</strong>
        <span className={styles.hint}>{L.scatterHint}</span>
      </p>

      {legendItems.length > 0 && (
        <div className={styles.legend} aria-hidden="true">
          {legendItems.map((q) => (
            <span key={`${q.performanceTier}-${q.potentialTier}`}>
              <span className={styles.legendSwatch} />
              {q.label}
              <span className={styles.legendCount}>({q.count})</span>
            </span>
          ))}
        </div>
      )}

      <div className={styles.chartFrame}>
        <div className={styles.yAxisLabel}>{L.axisPotential}</div>

        <div className={styles.yTicks} aria-hidden="true">
          {[...AXIS_TICKS].reverse().map((t) => (
            <span key={`y-${t}`}>{t}</span>
          ))}
        </div>

        <div className={styles.plotColumn}>
          <div
            className={styles.plot}
            role="application"
            aria-label={L.gridLabel}
            onClick={() => setSelected(null)}
          >
            <svg
              className={styles.gridSvg}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {NINE_BOX_GRID_LINES.map((g) => (
                <g key={g}>
                  <line
                    x1={g}
                    y1={0}
                    x2={g}
                    y2={100}
                    className={styles.gridLine}
                  />
                  <line
                    x1={0}
                    y1={100 - g}
                    x2={100}
                    y2={100 - g}
                    className={styles.gridLine}
                  />
                </g>
              ))}
            </svg>

            {data.quadrants.map((q) => {
              const pos = quadrantLabelPosition(
                q.performanceTier,
                q.potentialTier,
              );
              return (
                <span
                  key={`${q.performanceTier}-${q.potentialTier}`}
                  className={styles.quadrantLabel}
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                  }}
                >
                  {q.label}
                </span>
              );
            })}

            {data.points.map((point) => (
              <EmployeeDot
                key={point.appraisalId}
                point={point}
                isSelected={selected?.appraisalId === point.appraisalId}
                onSelect={() => setSelected(point)}
              />
            ))}
          </div>

          <div className={styles.xTicks} aria-hidden="true">
            {AXIS_TICKS.map((t) => (
              <span key={`x-${t}`}>{t}</span>
            ))}
          </div>
          <p className={styles.xAxisLabel}>{L.axisPerformance}</p>
        </div>
      </div>

      {selected && (
        <aside className={styles.detail} aria-live="polite">
          <header className={styles.detailHeader}>
            <span
              className={styles.detailAvatar}
              style={{ backgroundColor: avatarColorFromId(selected.employeeId) }}
              aria-hidden="true"
            >
              {getInitials(selected.employeeName)}
            </span>
            <div>
              <h3 className={styles.detailTitle}>{selected.employeeName}</h3>
              <p className={styles.detailQuadrant}>{selected.quadrantLabel}</p>
            </div>
            <button
              type="button"
              className={styles.detailClose}
              onClick={() => setSelected(null)}
            >
              {L.closeDetail}
            </button>
          </header>
          <dl className={styles.detailScores}>
            <div>
              <dt>{L.axisPerformance}</dt>
              <dd>
                {selected.performance.toFixed(2)}{" "}
                <span className={styles.pct}>
                  ({selected.performancePercent.toFixed(0)}%)
                </span>
              </dd>
            </div>
            <div>
              <dt>{L.axisPotential}</dt>
              <dd>
                {selected.potential.toFixed(2)}{" "}
                <span className={styles.pct}>
                  ({selected.potentialPercent.toFixed(0)}%)
                </span>
              </dd>
            </div>
          </dl>
        </aside>
      )}
    </div>
  );
}
