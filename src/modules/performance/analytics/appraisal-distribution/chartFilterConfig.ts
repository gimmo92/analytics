import type { ChartTabId } from "./components/ChartTabs";

export type ChartFilterField =
  | "cycle"
  | "department"
  | "manager"
  | "completedOnly";

/** Filtri disponibili per ciascun grafico */
export const CHART_FILTER_FIELDS: Record<ChartTabId, ChartFilterField[]> = {
  "nine-box": ["cycle", "department", "manager", "completedOnly"],
  histogram: ["cycle", "department", "completedOnly"],
  "bell-curve": ["cycle", "completedOnly"],
  "manager-heatmap": ["cycle", "department", "completedOnly"],
  "department-boxplot": ["cycle", "department", "completedOnly"],
};

export const CHART_TAB_IDS = Object.keys(
  CHART_FILTER_FIELDS,
) as ChartTabId[];
