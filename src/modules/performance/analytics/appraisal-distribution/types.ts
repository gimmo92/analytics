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
  cycleId: string;
  departmentId: string;
  managerId: string;
  finalRating: number;
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

export interface DistributionData {
  placeholder: true;
}

export interface ManagerHeatmapData {
  placeholder: true;
}

export interface DepartmentBoxplotData {
  placeholder: true;
}

export interface AppraisalAnalyticsResult {
  histogram: HistogramData | null;
  distribution: DistributionData | null;
  managerHeatmap: ManagerHeatmapData | null;
  departmentBoxplot: DepartmentBoxplotData | null;
  loading: boolean;
  error: Error | null;
  cycles: AppraisalCycle[];
  departments: Department[];
  managers: Manager[];
}
