import { useEffect, useRef } from "react";
import { labels } from "../labels";
import type { ManagerCalibrationBadge, ManagerHeatmapRow } from "../types";
import { getDepartmentNameForManager } from "../utils/managerHeatmap";
import styles from "./ManagerDrilldownModal.module.css";

interface ManagerDrilldownModalProps {
  row: ManagerHeatmapRow | null;
  onClose: () => void;
}

function badgeLabel(badge: ManagerCalibrationBadge): string {
  const L = labels.charts.managerHeatmap;
  switch (badge) {
    case "generous":
      return L.generous;
    case "strict":
      return L.strict;
    default:
      return L.aligned;
  }
}

export function ManagerDrilldownModal({
  row,
  onClose,
}: ManagerDrilldownModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!row) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [row, onClose]);

  if (!row) return null;

  console.log("[onManagerClick]", row.managerId, row);

  const L = labels.modal;
  const dept = getDepartmentNameForManager(row.managerId);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h3 id="manager-modal-title" className={styles.title}>
            {L.title}: {row.managerName}
          </h3>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
          >
            {L.close}
          </button>
        </header>
        <dl className={styles.meta}>
          <div>
            <dt>{L.department}</dt>
            <dd>{dept}</dd>
          </div>
          <div>
            <dt>{L.average}</dt>
            <dd>{row.averageRating.toFixed(2)}</dd>
          </div>
          <div>
            <dt>{L.total}</dt>
            <dd>{row.totalCount}</dd>
          </div>
          <div>
            <dt>{L.calibration}</dt>
            <dd>
              <span
                className={`${styles.badge} ${
                  row.badge === "generous"
                    ? styles.generous
                    : row.badge === "strict"
                      ? styles.strict
                      : styles.aligned
                }`}
              >
                {badgeLabel(row.badge)}
              </span>
            </dd>
          </div>
        </dl>
        <p className={styles.placeholder}>{L.placeholder}</p>
      </div>
    </div>
  );
}
