import { useEffect, useMemo, useState } from "react";
import {
  MOCK_CYCLES,
  MOCK_DEPARTMENTS,
  MOCK_MANAGERS,
} from "../data/mockAppraisalData";
import type {
  AppraisalAnalyticsFilters,
  AppraisalAnalyticsResult,
  ExpectedDistributionConfig,
} from "../types";
import { buildTeamHistogram } from "../utils/teamHistogram";
import { buildDistribution } from "../utils/distribution";
import { filterAppraisals } from "../utils/filterAppraisals";
import { buildHistogram } from "../utils/histogram";
import { buildManagerHeatmap } from "../utils/managerHeatmap";
import { buildNineBox } from "../utils/nineBox";

const MOCK_LATENCY_MS = 400;

const DEFAULT_EXPECTED_DISTRIBUTION: ExpectedDistributionConfig = {
  type: "normal",
  mean: 3.0,
  sigma: 0.8,
};

export interface UseAppraisalAnalyticsOptions {
  expectedDistribution?: ExpectedDistributionConfig;
}

// TODO: replace with API call to /api/performance/analytics/distribution
export function useAppraisalAnalytics(
  filters: AppraisalAnalyticsFilters,
  options: UseAppraisalAnalyticsOptions = {},
): AppraisalAnalyticsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const expectedDistribution =
    options.expectedDistribution ?? DEFAULT_EXPECTED_DISTRIBUTION;

  const filtered = useMemo(
    () => filterAppraisals(filters),
    [filters],
  );

  const histogram = useMemo(() => {
    if (filtered.length === 0) return null;
    return buildHistogram(filtered);
  }, [filtered]);

  const distribution = useMemo(() => {
    if (filtered.length === 0) return null;
    return buildDistribution(filtered, expectedDistribution);
  }, [filtered, expectedDistribution]);

  const managerHeatmap = useMemo(() => {
    if (filtered.length === 0) return null;
    return buildManagerHeatmap(filtered);
  }, [filtered]);

  const teamHistogram = useMemo(() => {
    if (filtered.length === 0) return null;
    return buildTeamHistogram(filtered);
  }, [filtered]);

  const nineBox = useMemo(() => {
    if (filtered.length === 0) return null;
    return buildNineBox(filtered);
  }, [filtered]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, MOCK_LATENCY_MS);
    return () => window.clearTimeout(timer);
  }, [filters]);

  return {
    histogram,
    distribution,
    managerHeatmap,
    teamHistogram,
    nineBox,
    loading,
    error,
    cycles: MOCK_CYCLES,
    departments: MOCK_DEPARTMENTS,
    managers: MOCK_MANAGERS,
  };
}
