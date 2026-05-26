import { useMemo, useState } from "react";
import { AnalyticsFilters } from "./components/AnalyticsFilters";
import { ChartCard } from "./components/ChartCard";
import {
  ChartTabs,
  type ChartTabId,
} from "./components/ChartTabs";
import { ManagerDrilldownModal } from "./components/ManagerDrilldownModal";
import { BellCurveChart } from "./components/charts/BellCurveChart";
import { DepartmentBoxplotChart } from "./components/charts/DepartmentBoxplotChart";
import { ManagerHeatmapChart } from "./components/charts/ManagerHeatmapChart";
import { GlobalNineBoxChart } from "./components/charts/GlobalNineBoxChart";
import { RatingHistogramChart } from "./components/charts/RatingHistogramChart";
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
  {
    id: "department-boxplot" as const,
    label: labels.tabs.departmentBoxplot,
  },
];

export function AppraisalDistributionView() {
  const [filters, setFilters] = useState<AppraisalAnalyticsFilters>(() => ({
    cycleId: getDefaultClosedCycleId(),
    departmentIds: [],
    managerIds: [],
    completedOnly: true,
  }));

  const [activeTab, setActiveTab] = useState<ChartTabId>("nine-box");
  const [selectedManager, setSelectedManager] =
    useState<ManagerHeatmapRow | null>(null);

  const analytics = useAppraisalAnalytics(filters);

  const isEmpty = useMemo(() => {
    if (analytics.loading) return false;
    return analytics.histogram === null;
  }, [analytics.loading, analytics.histogram]);

  const handleManagerClick = (managerId: string, row: ManagerHeatmapRow) => {
    console.log("[onManagerClick]", managerId, row);
    setSelectedManager(row);
  };

  const renderActiveChart = () => {
    switch (activeTab) {
      case "nine-box":
        return (
          <ChartCard
            chartId="nine-box"
            title={labels.charts.nineBox.title}
            subtitle={labels.charts.nineBox.subtitle}
            helpText={labels.charts.nineBox.help}
            ariaLabel={labels.charts.nineBox.ariaLabel}
            loading={analytics.loading}
            empty={isEmpty}
          >
            {analytics.nineBox && <GlobalNineBoxChart data={analytics.nineBox} />}
          </ChartCard>
        );
      case "histogram":
        return (
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
        );
      case "bell-curve":
        return (
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
        );
      case "manager-heatmap":
        return (
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
        );
      case "department-boxplot":
        return (
          <ChartCard
            chartId="department-boxplot"
            title={labels.charts.departmentBoxplot.title}
            subtitle={labels.charts.departmentBoxplot.subtitle}
            helpText={labels.charts.departmentBoxplot.help}
            ariaLabel={labels.charts.departmentBoxplot.ariaLabel}
            loading={analytics.loading}
            empty={isEmpty}
          >
            {analytics.departmentBoxplot && (
              <DepartmentBoxplotChart data={analytics.departmentBoxplot} />
            )}
          </ChartCard>
        );
    }
  };

  return (
    <div className={styles.page}>
      <AnalyticsFilters
        filters={filters}
        cycles={analytics.cycles}
        departments={analytics.departments}
        managers={analytics.managers}
        onChange={setFilters}
      />

      <ChartTabs
        tabs={CHART_TABS}
        activeId={activeTab}
        onChange={setActiveTab}
      >
        {renderActiveChart()}
      </ChartTabs>

      <ManagerDrilldownModal
        row={selectedManager}
        onClose={() => setSelectedManager(null)}
      />
    </div>
  );
}
