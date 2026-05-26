import {
  MOCK_DEPARTMENTS,
  MOCK_MANAGERS,
} from "../data/mockAppraisalData";
import type {
  Appraisal,
  ManagerCalibrationBadge,
  ManagerHeatmapData,
  ManagerHeatmapRow,
  RatingBucketId,
} from "../types";
import {
  MANAGER_CALIBRATION_THRESHOLD,
  RATING_BUCKETS,
} from "../types";

function ratingToBucketId(rating: number): RatingBucketId {
  const bucket = RATING_BUCKETS.find(
    (b) => rating >= b.min && rating <= b.max,
  );
  return bucket?.id ?? "3";
}

function emptyBucketCounts(): Record<RatingBucketId, number> {
  return { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
}

function resolveBadge(
  deviation: number,
  threshold: number,
): ManagerCalibrationBadge {
  if (deviation > threshold) return "generous";
  if (deviation < -threshold) return "strict";
  return "aligned";
}

export function buildManagerHeatmap(
  appraisals: Appraisal[],
  calibrationThreshold = MANAGER_CALIBRATION_THRESHOLD,
): ManagerHeatmapData {
  const companyMean =
    appraisals.length > 0
      ? appraisals.reduce((s, a) => s + a.finalRating, 0) / appraisals.length
      : 0;

  const managerMap = new Map<string, Appraisal[]>();
  for (const a of appraisals) {
    const list = managerMap.get(a.managerId) ?? [];
    list.push(a);
    managerMap.set(a.managerId, list);
  }

  const rows: ManagerHeatmapRow[] = [];

  for (const manager of MOCK_MANAGERS) {
    const list = managerMap.get(manager.id);
    if (!list?.length) continue;

    const bucketCounts = emptyBucketCounts();
    let sum = 0;
    for (const a of list) {
      bucketCounts[ratingToBucketId(a.finalRating)] += 1;
      sum += a.finalRating;
    }

    const averageRating = sum / list.length;
    const deviation = averageRating - companyMean;

    rows.push({
      managerId: manager.id,
      managerName: manager.name,
      bucketCounts,
      averageRating,
      totalCount: list.length,
      badge: resolveBadge(deviation, calibrationThreshold),
      deviationFromCompanyMean: deviation,
    });
  }

  const maxCellCount = Math.max(
    1,
    ...rows.flatMap((r) => Object.values(r.bucketCounts)),
  );

  return {
    rows,
    companyMean,
    calibrationThreshold,
    maxCellCount,
  };
}

export function getTeamNameForManager(managerId: string): string {
  const manager = MOCK_MANAGERS.find((m) => m.id === managerId);
  if (!manager) return "";
  return (
    MOCK_DEPARTMENTS.find((d) => d.id === manager.departmentId)?.name ?? ""
  );
}
