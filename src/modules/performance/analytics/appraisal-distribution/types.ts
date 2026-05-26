export type AppraisalStatus = "completed" | "in_progress" | "draft";

export interface Department {
  id: string;
  name: string;
}

export interface Manager {
  id: string;
  name: string;
  departmentId: string;
}

export interface AppraisalCycle {
  id: string;
  name: string;
  status: "open" | "closed";
  closedAt?: string;
}

export interface Appraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  cycleId: string;
  departmentId: string;
  managerId: string;
  /** Performance (asse X della 9-box) */
  finalRating: number;
  /** Potenziale (asse Y della 9-box) */
  potentialRating: number;
  status: AppraisalStatus;
}

export type RatingBucketId = "1" | "2" | "3" | "4" | "5";

export interface RatingBucket {
  id: RatingBucketId;
  label: string;
  min: number;
  max: number;
}

export const RATING_BUCKETS: RatingBucket[] = [
  { id: "1", label: "1", min: 1, max: 1.49 },
  { id: "2", label: "2", min: 1.5, max: 2.49 },
  { id: "3", label: "3", min: 2.5, max: 3.49 },
  { id: "4", label: "4", min: 3.5, max: 4.49 },
  { id: "5", label: "5", min: 4.5, max: 5 },
];

export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const RATING_BIN_SIZE = 0.25;

/** Scostamento dalla media aziendale oltre cui il manager è Generoso/Severo */
export const MANAGER_CALIBRATION_THRESHOLD = 0.4;

export interface AppraisalAnalyticsFilters {
  cycleId: string;
  departmentIds: string[];
  managerIds: string[];
  completedOnly: boolean;
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  binLabel: string;
  count: number;
  percentage: number;
}

export interface HistogramData {
  bins: HistogramBin[];
  mean: number;
  total: number;
}

export interface ExpectedDistributionConfig {
  type: "normal" | "percentages";
  mean?: number;
  sigma?: number;
  /** Percentuali per bucket 1–5 (es. 10/20/40/20/10) */
  percentages?: Partial<Record<RatingBucketId, number>>;
}

export interface DistributionPoint {
  x: number;
  realDensity: number;
  expectedDensity: number;
  gap: number;
}

export interface DistributionData {
  points: DistributionPoint[];
  meanDeviation: number;
  realMean: number;
  expectedMean: number;
}

export type ManagerCalibrationBadge = "generous" | "strict" | "aligned";

export type ManagerHeatmapSortKey =
  | "name"
  | "avgAsc"
  | "avgDesc"
  | "countDesc";

export interface ManagerHeatmapRow {
  managerId: string;
  managerName: string;
  bucketCounts: Record<RatingBucketId, number>;
  averageRating: number;
  totalCount: number;
  badge: ManagerCalibrationBadge;
  deviationFromCompanyMean: number;
}

export interface ManagerHeatmapData {
  rows: ManagerHeatmapRow[];
  companyMean: number;
  calibrationThreshold: number;
  maxCellCount: number;
}

export interface DepartmentBoxplotItem {
  departmentId: string;
  departmentName: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  sampleSize: number;
}

export interface DepartmentBoxplotData {
  departments: DepartmentBoxplotItem[];
  companyMean: number;
}

export type NineBoxTier = 1 | 2 | 3;

export interface NineBoxPlacement {
  appraisalId: string;
  employeeId: string;
  employeeName: string;
  performance: number;
  potential: number;
  performanceTier: NineBoxTier;
  potentialTier: NineBoxTier;
}

export interface NineBoxCell {
  performanceTier: NineBoxTier;
  potentialTier: NineBoxTier;
  label: string;
  count: number;
  percentage: number;
  employees: NineBoxPlacement[];
}

export interface NineBoxData {
  cells: NineBoxCell[];
  total: number;
  performanceThresholds: { p33: number; p66: number };
  potentialThresholds: { p33: number; p66: number };
}

export interface AppraisalAnalyticsResult {
  histogram: HistogramData | null;
  distribution: DistributionData | null;
  managerHeatmap: ManagerHeatmapData | null;
  departmentBoxplot: DepartmentBoxplotData | null;
  nineBox: NineBoxData | null;
  loading: boolean;
  error: Error | null;
  cycles: AppraisalCycle[];
  departments: Department[];
  managers: Manager[];
}
