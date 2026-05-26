import type {
  AppraisalAnalyticsFilters,
  AppraisalCycle,
  Department,
  Manager,
} from "../types";
import { labels } from "../labels";
import styles from "./AnalyticsFilters.module.css";

interface AnalyticsFiltersProps {
  filters: AppraisalAnalyticsFilters;
  cycles: AppraisalCycle[];
  departments: Department[];
  managers: Manager[];
  onChange: (next: AppraisalAnalyticsFilters) => void;
}

export function AnalyticsFilters({
  filters,
  cycles,
  departments,
  managers,
  onChange,
}: AnalyticsFiltersProps) {
  const visibleManagers =
    filters.departmentIds.length === 0
      ? managers
      : managers.filter((m) =>
          filters.departmentIds.includes(m.departmentId),
        );

  const toggleMulti = (
    field: "departmentIds" | "managerIds",
    id: string,
  ) => {
    const current = filters[field];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    onChange({ ...filters, [field]: next });
  };

  return (
    <div className={styles.bar} role="search" aria-label="Filtri analytics">
      <label className={styles.field}>
        <span className={styles.label}>{labels.filters.cycle}</span>
        <select
          value={filters.cycleId}
          onChange={(e) =>
            onChange({ ...filters, cycleId: e.target.value })
          }
        >
          {cycles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.status === "closed" ? " (chiuso)" : ""}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>{labels.filters.department}</legend>
        <div className={styles.chips}>
          {departments.map((d) => (
            <label key={d.id} className={styles.chip}>
              <input
                type="checkbox"
                checked={filters.departmentIds.includes(d.id)}
                onChange={() => toggleMulti("departmentIds", d.id)}
              />
              <span>{d.name}</span>
            </label>
          ))}
        </div>
        {filters.departmentIds.length === 0 && (
          <span className={styles.hint}>{labels.filters.allDepartments}</span>
        )}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>{labels.filters.manager}</legend>
        <div className={styles.chips}>
          {visibleManagers.map((m) => (
            <label key={m.id} className={styles.chip}>
              <input
                type="checkbox"
                checked={filters.managerIds.includes(m.id)}
                onChange={() => toggleMulti("managerIds", m.id)}
              />
              <span>{m.name}</span>
            </label>
          ))}
        </div>
        {filters.managerIds.length === 0 && (
          <span className={styles.hint}>{labels.filters.allManagers}</span>
        )}
      </fieldset>

      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={filters.completedOnly}
          onChange={(e) =>
            onChange({ ...filters, completedOnly: e.target.checked })
          }
        />
        <span>{labels.filters.completedOnly}</span>
      </label>
    </div>
  );
}
