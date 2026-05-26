import type { ChartTabId } from "./components/ChartTabs";

export type ChartFilterField = "cycle" | "department" | "manager";

/** Filtri disponibili per ciascun grafico */
export const CHART_FILTER_FIELDS: Record<ChartTabId, ChartFilterField[]> = {
  "nine-box": ["cycle", "department", "manager"],
  histogram: ["cycle", "department"],
  "bell-curve": ["cycle"],
  "manager-heatmap": ["cycle", "department"],
  "team-histogram": ["cycle", "department"],
};

export const CHART_TAB_IDS = Object.keys(
  CHART_FILTER_FIELDS,
) as ChartTabId[];
