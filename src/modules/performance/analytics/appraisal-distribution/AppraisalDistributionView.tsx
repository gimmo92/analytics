import { useCallback, useMemo, useState } from "react";
import { AnalyticsFilters } from "./components/AnalyticsFilters";
import { ChartCard } from "./components/ChartCard";
import {
  ChartTabs,
  type ChartTabId,
} from "./components/ChartTabs";
import { ManagerDrilldownModal } from "./components/ManagerDrilldownModal";
import { BellCurveChart } from "./components/charts/BellCurveChart";
import { TeamComparisonHistogramChart } from "./components/charts/TeamComparisonHistogramChart";
import { ManagerHeatmapChart } from "./components/charts/ManagerHeatmapChart";
import { GlobalNineBoxChart } from "./components/charts/GlobalNineBoxChart";
import { RatingHistogramChart } from "./components/charts/RatingHistogramChart";
import {
  CHART_FILTER_FIELDS,
  CHART_TAB_IDS,
} from "./chartFilterConfig";
import { getDefaultClosedCycleId } from "./data/mockAppraisalData";
import { useAppraisalAnalytics } from "./hooks/useAppraisalAnalytics";
import { labels } from "./labels";
import type { AppraisalAnalyticsFilters } from "./types";
import type { ManagerHeatmapRow } from "./types";
import styles from "./AppraisalDistributionView.module.css";

const CHART_TABS = [
  { id: "nine-box" as const, label: labels.tabs.nineBox },
  { id: "histogram" as const, label: labels.tabs.histogram },
  { id: "bell-curve" as const, label: labels.tabs.bellCurve },
  { id: "manager-heatmap" as const, label: labels.tabs.managerHeatmap },
  { id: "team-histogram" as const, label: labels.tabs.teamHistogram },
];

function createDefaultFilters(): AppraisalAnalyticsFilters {
  return {
    cycleId: getDefaultClosedCycleId(),
    departmentIds: [],
    managerIds: [],
  };
}

function createInitialFiltersByTab(): Record<
  ChartTabId,
  AppraisalAnalyticsFilters
> {
  return CHART_TAB_IDS.reduce(
    (acc, tabId) => {
      acc[tabId] = createDefaultFilters();
      return acc;
    },
    {} as Record<ChartTabId, AppraisalAnalyticsFilters>,
  );
}

const TAB_LABEL_FOR_FILTERS: Record<ChartTabId, string> = {
  "nine-box": labels.tabs.nineBox,
  histogram: labels.tabs.histogram,
  "bell-curve": labels.tabs.bellCurve,
  "manager-heatmap": labels.tabs.managerHeatmap,
  "team-histogram": labels.tabs.teamHistogram,
};

export function AppraisalDistributionView() {
  const [filtersByTab, setFiltersByTab] = useState(createInitialFiltersByTab);
  const [activeTab, setActiveTab] = useState<ChartTabId>("nine-box");
  const [selectedManager, setSelectedManager] =
    useState<ManagerHeatmapRow | null>(null);

  const activeFilters = filtersByTab[activeTab];
  const analytics = useAppraisalAnalytics(activeFilters);

  const setFiltersForTab = useCallback(
    (tab: ChartTabId, next: AppraisalAnalyticsFilters) => {
      setFiltersByTab((prev) => ({ ...prev, [tab]: next }));
    },
    [],
  );

  const isEmpty = useMemo(() => {
    if (analytics.loading) return false;
    switch (activeTab) {
      case "nine-box":
        return analytics.nineBox === null;
      case "histogram":
        return analytics.histogram === null;
      case "bell-curve":
        return analytics.distribution === null;
      case "manager-heatmap":
        return analytics.managerHeatmap === null;
      case "team-histogram":
        return analytics.teamHistogram === null;
    }
  }, [activeTab, analytics]);

  const handleManagerClick = (managerId: string, row: ManagerHeatmapRow) => {
    console.log("[onManagerClick]", managerId, row);
    setSelectedManager(row);
  };

  const renderChartFilters = () => (
    <AnalyticsFilters
      fields={CHART_FILTER_FIELDS[activeTab]}
      filters={activeFilters}
      cycles={analytics.cycles}
      departments={analytics.departments}
      managers={analytics.managers}
      onChange={(next) => setFiltersForTab(activeTab, next)}
      ariaLabel={`${labels.filters.ariaChart} — ${TAB_LABEL_FOR_FILTERS[activeTab]}`}
    />
  );

  const renderActiveChart = () => {
    switch (activeTab) {
      case "nine-box":
        return (
          <>
            {renderChartFilters()}
            <ChartCard
              chartId="nine-box"
              title={labels.charts.nineBox.title}
              subtitle={labels.charts.nineBox.subtitle}
              helpText={labels.charts.nineBox.help}
              ariaLabel={labels.charts.nineBox.ariaLabel}
              loading={analytics.loading}
              empty={isEmpty}
            >
              {analytics.nineBox && (
                <GlobalNineBoxChart data={analytics.nineBox} />
              )}
            </ChartCard>
          </>
        );
      case "histogram":
        return (
          <>
            {renderChartFilters()}
            <ChartCard
              chartId="histogram"
              title={labels.charts.histogram.title}
              subtitle={labels.charts.histogram.subtitle}
              helpText={labels.charts.histogram.help}
              ariaLabel={labels.charts.histogram.ariaLabel}
              loading={analytics.loading}
              empty={isEmpty}
            >
              {analytics.histogram && (
                <RatingHistogramChart data={analytics.histogram} />
              )}
            </ChartCard>
          </>
        );
      case "bell-curve":
        return (
          <>
            {renderChartFilters()}
            <ChartCard
              chartId="bell-curve"
              title={labels.charts.bellCurve.title}
              subtitle={labels.charts.bellCurve.subtitle}
              helpText={labels.charts.bellCurve.help}
              ariaLabel={labels.charts.bellCurve.ariaLabel}
              loading={analytics.loading}
              empty={isEmpty}
            >
              {analytics.distribution && (
                <BellCurveChart data={analytics.distribution} />
              )}
            </ChartCard>
          </>
        );
      case "manager-heatmap":
        return (
          <>
            {renderChartFilters()}
            <ChartCard
              chartId="manager-heatmap"
              title={labels.charts.managerHeatmap.title}
              subtitle={labels.charts.managerHeatmap.subtitle}
              helpText={labels.charts.managerHeatmap.help}
              ariaLabel={labels.charts.managerHeatmap.ariaLabel}
              loading={analytics.loading}
              empty={isEmpty}
            >
              {analytics.managerHeatmap && (
                <ManagerHeatmapChart
                  data={analytics.managerHeatmap}
                  onManagerClick={handleManagerClick}
                />
              )}
            </ChartCard>
          </>
        );
      case "team-histogram":
        return (
          <>
            {renderChartFilters()}
            <ChartCard
              chartId="team-histogram"
              title={labels.charts.teamHistogram.title}
              subtitle={labels.charts.teamHistogram.subtitle}
              helpText={labels.charts.teamHistogram.help}
              ariaLabel={labels.charts.teamHistogram.ariaLabel}
              loading={analytics.loading}
              empty={isEmpty}
            >
              {analytics.teamHistogram && (
                <TeamComparisonHistogramChart data={analytics.teamHistogram} />
              )}
            </ChartCard>
          </>
        );
    }
  };

  return (
    <div className={styles.page}>
      <ChartTabs
        tabs={CHART_TABS}
        activeId={activeTab}
        onChange={setActiveTab}
      >
        <div className={styles.chartPanel}>{renderActiveChart()}</div>
      </ChartTabs>

      <ManagerDrilldownModal
        row={selectedManager}
        onClose={() => setSelectedManager(null)}
      />
    </div>
  );
}
