import { MOCK_DEPARTMENTS } from "../data/mockAppraisalData";
import type { Appraisal, DepartmentBoxplotData, DepartmentBoxplotItem } from "../types";

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const pos = (sorted.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1];
  if (next !== undefined) {
    return sorted[base] + rest * (next - sorted[base]);
  }
  return sorted[base];
}

function computeBoxplotStats(
  ratings: number[],
  departmentId: string,
  departmentName: string,
): DepartmentBoxplotItem {
  const sorted = [...ratings].sort((a, b) => a - b);
  const q1 = percentile(sorted, 0.25);
  const median = percentile(sorted, 0.5);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = sorted.filter(
    (r) => r < lowerFence || r > upperFence,
  );
  const inliers = sorted.filter(
    (r) => r >= lowerFence && r <= upperFence,
  );

  return {
    departmentId,
    departmentName,
    min: inliers[0] ?? sorted[0],
    q1,
    median,
    q3,
    max: inliers[inliers.length - 1] ?? sorted[sorted.length - 1],
    outliers,
    sampleSize: sorted.length,
  };
}

export function buildDepartmentBoxplot(
  appraisals: Appraisal[],
): DepartmentBoxplotData {
  const companyMean =
    appraisals.length > 0
      ? appraisals.reduce((s, a) => s + a.finalRating, 0) / appraisals.length
      : 0;

  const byDept = new Map<string, number[]>();
  for (const a of appraisals) {
    const list = byDept.get(a.departmentId) ?? [];
    list.push(a.finalRating);
    byDept.set(a.departmentId, list);
  }

  const departments: DepartmentBoxplotItem[] = [];

  for (const dept of MOCK_DEPARTMENTS) {
    const ratings = byDept.get(dept.id);
    if (!ratings?.length) continue;
    departments.push(computeBoxplotStats(ratings, dept.id, dept.name));
  }

  return { departments, companyMean };
}

export type BoxplotSortMode = "medianDesc" | "alphabetical";

export function sortBoxplotDepartments(
  departments: DepartmentBoxplotItem[],
  mode: BoxplotSortMode,
): DepartmentBoxplotItem[] {
  const copy = [...departments];
  if (mode === "alphabetical") {
    copy.sort((a, b) => a.departmentName.localeCompare(b.departmentName, "it"));
  } else {
    copy.sort((a, b) => b.median - a.median);
  }
  return copy;
}
