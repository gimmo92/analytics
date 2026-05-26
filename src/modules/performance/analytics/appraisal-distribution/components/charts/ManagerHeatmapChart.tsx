import { useMemo, useState } from "react";
import { labels } from "../../labels";
import type {
  ManagerHeatmapData,
  ManagerHeatmapRow,
  ManagerHeatmapSortKey,
  RatingBucketId,
} from "../../types";
import { RATING_BUCKETS } from "../../types";
import styles from "./ManagerHeatmapChart.module.css";

const PAGE_SIZE = 15;

interface ManagerHeatmapChartProps {
  data: ManagerHeatmapData;
  onManagerClick: (managerId: string, row: ManagerHeatmapRow) => void;
}

function sortRows(
  rows: ManagerHeatmapRow[],
  sortKey: ManagerHeatmapSortKey,
): ManagerHeatmapRow[] {
  const copy = [...rows];
  switch (sortKey) {
    case "name":
      copy.sort((a, b) => a.managerName.localeCompare(b.managerName, "it"));
      break;
    case "avgAsc":
      copy.sort((a, b) => a.averageRating - b.averageRating);
      break;
    case "avgDesc":
      copy.sort((a, b) => b.averageRating - a.averageRating);
      break;
    case "countDesc":
      copy.sort((a, b) => b.totalCount - a.totalCount);
      break;
  }
  return copy;
}

function badgeLabel(row: ManagerHeatmapRow): string {
  const L = labels.charts.managerHeatmap;
  switch (row.badge) {
    case "generous":
      return L.generous;
    case "strict":
      return L.strict;
    default:
      return L.aligned;
  }
}

function cellIntensity(count: number, max: number): number {
  if (max <= 0 || count === 0) return 0;
  return 0.12 + (count / max) * 0.88;
}

export function ManagerHeatmapChart({
  data,
  onManagerClick,
}: ManagerHeatmapChartProps) {
  const L = labels.charts.managerHeatmap;
  const [sortKey, setSortKey] = useState<ManagerHeatmapSortKey>("avgDesc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(
    () => sortRows(data.rows, sortKey),
    [data.rows, sortKey],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  const bucketIds = RATING_BUCKETS.map((b) => b.id);

  return (
    <div className={styles.wrap} role="region" aria-label={L.ariaLabel}>
      <div className={styles.toolbar}>
        <label className={styles.sortLabel}>
          {L.sortBy}
          <select
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value as ManagerHeatmapSortKey);
              setPage(0);
            }}
            aria-label={L.sortBy}
          >
            <option value="name">{L.sortName}</option>
            <option value="avgAsc">{L.sortAvgAsc}</option>
            <option value="avgDesc">{L.sortAvgDesc}</option>
            <option value="countDesc">{L.sortCount}</option>
          </select>
        </label>
        {sorted.length > PAGE_SIZE && (
          <div className={styles.pagination}>
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              {L.prev}
            </button>
            <span>
              {L.page} {safePage + 1} {L.of} {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              {L.next}
            </button>
          </div>
        )}
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{L.manager}</th>
              {RATING_BUCKETS.map((b) => (
                <th key={b.id} scope="col" className={styles.bucketHead}>
                  {b.label}
                </th>
              ))}
              <th scope="col">{L.average}</th>
              <th scope="col">{L.total}</th>
              <th scope="col">{L.calibration}</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row.managerId}
                className={styles.row}
                tabIndex={0}
                onClick={() => onManagerClick(row.managerId, row)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onManagerClick(row.managerId, row);
                  }
                }}
                aria-label={`${row.managerName}. ${L.clickHint}`}
              >
                <th scope="row" className={styles.managerName}>
                  {row.managerName}
                </th>
                {bucketIds.map((id: RatingBucketId) => {
                  const count = row.bucketCounts[id];
                  const intensity = cellIntensity(
                    count,
                    data.maxCellCount,
                  );
                  return (
                    <td
                      key={id}
                      className={styles.cell}
                      style={{
                        backgroundColor: `rgba(37, 99, 235, ${intensity})`,
                        color:
                          intensity > 0.55
                            ? "#fff"
                            : "var(--color-text-primary)",
                      }}
                    >
                      {count > 0 ? count : "—"}
                    </td>
                  );
                })}
                <td className={styles.metaCell}>
                  {row.averageRating.toFixed(2)}
                </td>
                <td className={styles.metaCell}>{row.totalCount}</td>
                <td className={styles.metaCell}>
                  <span
                    className={`${styles.badge} ${
                      row.badge === "generous"
                        ? styles.generous
                        : row.badge === "strict"
                          ? styles.strict
                          : styles.aligned
                    }`}
                  >
                    {badgeLabel(row)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
