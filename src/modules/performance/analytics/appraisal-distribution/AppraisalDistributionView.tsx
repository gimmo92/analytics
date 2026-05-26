import { useMemo, useState } from "react";
import { AnalyticsFilters } from "./components/AnalyticsFilters";
import { ChartCard } from "./components/ChartCard";
import { ChartPlaceholder } from "./components/charts/ChartPlaceholder";
import { RatingHistogramChart } from "./components/charts/RatingHistogramChart";
import { getDefaultClosedCycleId } from "./data/mockAppraisalData";
import { useAppraisalAnalytics } from "./hooks/useAppraisalAnalytics";
import { labels } from "./labels";
import type { AppraisalAnalyticsFilters } from "./types";
import styles from "./AppraisalDistributionView.module.css";

export function AppraisalDistributionView() {
  const [filters, setFilters] = useState<AppraisalAnalyticsFilters>(() => ({
    cycleId: getDefaultClosedCycleId(),
    departmentIds: [],
    managerIds: [],
    completedOnly: true,
  }));

  const analytics = useAppraisalAnalytics(filters);

  const isEmpty = useMemo(() => {
    if (analytics.loading) return false;
    return analytics.histogram === null;
  }, [analytics.loading, analytics.histogram]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{labels.pageTitle}</h1>
        <p className={styles.pageSubtitle}>{labels.pageSubtitle}</p>
      </header>

      <AnalyticsFilters
        filters={filters}
        cycles={analytics.cycles}
        departments={analytics.departments}
        managers={analytics.managers}
        onChange={setFilters}
      />

      <div className={styles.grid}>
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

        <ChartCard
          chartId="bell-curve"
          title={labels.charts.bellCurve.title}
          subtitle={labels.charts.bellCurve.subtitle}
          helpText={labels.charts.bellCurve.help}
          ariaLabel={labels.charts.bellCurve.ariaLabel}
          loading={analytics.loading}
          empty={isEmpty}
        >
          <ChartPlaceholder />
        </ChartCard>

        <ChartCard
          chartId="manager-heatmap"
          title={labels.charts.managerHeatmap.title}
          subtitle={labels.charts.managerHeatmap.subtitle}
          helpText={labels.charts.managerHeatmap.help}
          ariaLabel={labels.charts.managerHeatmap.ariaLabel}
          loading={analytics.loading}
          empty={isEmpty}
        >
          <ChartPlaceholder />
        </ChartCard>

        <ChartCard
          chartId="department-boxplot"
          title={labels.charts.departmentBoxplot.title}
          subtitle={labels.charts.departmentBoxplot.subtitle}
          helpText={labels.charts.departmentBoxplot.help}
          ariaLabel={labels.charts.departmentBoxplot.ariaLabel}
          loading={analytics.loading}
          empty={isEmpty}
        >
          <ChartPlaceholder />
        </ChartCard>
      </div>
    </div>
  );
}
