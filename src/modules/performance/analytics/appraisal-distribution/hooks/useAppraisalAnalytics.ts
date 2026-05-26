import { useEffect, useMemo, useState } from "react";
import {
  MOCK_CYCLES,
  MOCK_DEPARTMENTS,
  MOCK_MANAGERS,
} from "../data/mockAppraisalData";
import type {
  AppraisalAnalyticsFilters,
  AppraisalAnalyticsResult,
} from "../types";
import { filterAppraisals } from "../utils/filterAppraisals";
import { buildHistogram } from "../utils/histogram";

const MOCK_LATENCY_MS = 400;

// TODO: replace with API call to /api/performance/analytics/distribution
export function useAppraisalAnalytics(
  filters: AppraisalAnalyticsFilters,
): AppraisalAnalyticsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filtered = useMemo(
    () => filterAppraisals(filters),
    [filters],
  );

  const histogram = useMemo(() => {
    if (filtered.length === 0) return null;
    return buildHistogram(filtered);
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
    distribution: filtered.length > 0 ? { placeholder: true } : null,
    managerHeatmap: filtered.length > 0 ? { placeholder: true } : null,
    departmentBoxplot: filtered.length > 0 ? { placeholder: true } : null,
    loading,
    error,
    cycles: MOCK_CYCLES,
    departments: MOCK_DEPARTMENTS,
    managers: MOCK_MANAGERS,
  };
}
