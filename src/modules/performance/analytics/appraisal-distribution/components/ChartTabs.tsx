import { type KeyboardEvent, type ReactNode, useId } from "react";
import styles from "./ChartTabs.module.css";

export type ChartTabId =
  | "histogram"
  | "bell-curve"
  | "manager-heatmap"
  | "team-histogram"
  | "nine-box";

export interface ChartTabItem {
  id: ChartTabId;
  label: string;
}

interface ChartTabsProps {
  tabs: ChartTabItem[];
  activeId: ChartTabId;
  onChange: (id: ChartTabId) => void;
  children: ReactNode;
}

export function ChartTabs({
  tabs,
  activeId,
  onChange,
  children,
}: ChartTabsProps) {
  const baseId = useId();

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    onChange(tabs[nextIndex].id);
    document.getElementById(`${baseId}-tab-${tabs[nextIndex].id}`)?.focus();
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.tabList}
        role="tablist"
        aria-label="Grafici analytics"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              className={selected ? styles.tabActive : styles.tab}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={!selected}
            className={styles.panel}
          >
            {selected ? children : null}
          </div>
        );
      })}
    </div>
  );
}
