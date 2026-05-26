import type { Appraisal, DistributionData, ExpectedDistributionConfig } from "../types";
import {
  RATING_BUCKETS,
  RATING_MAX,
  RATING_MIN,
  type DistributionPoint,
  type RatingBucketId,
} from "../types";

const DEFAULT_EXPECTED: ExpectedDistributionConfig = {
  type: "normal",
  mean: 3.0,
  sigma: 0.8,
};

const CURVE_STEP = 0.08;

function gaussianKernel(u: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
}

function silvermanBandwidth(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0.35;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
  const std = Math.sqrt(variance) || 0.5;
  return Math.max(0.2, 1.06 * std * n ** -0.2);
}

function kde(values: number[], x: number, bandwidth: number): number {
  const n = values.length;
  if (n === 0) return 0;
  let sum = 0;
  for (const v of values) {
    sum += gaussianKernel((x - v) / bandwidth);
  }
  return sum / (n * bandwidth);
}

function normalPdf(x: number, mean: number, sigma: number): number {
  const z = (x - mean) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

function bucketPercentDensity(
  x: number,
  percentages: Partial<Record<RatingBucketId, number>>,
): number {
  const bucket = RATING_BUCKETS.find(
    (b) => x >= b.min && x <= b.max,
  );
  if (!bucket) return 0;
  const pct = percentages[bucket.id] ?? 0;
  const width = bucket.max - bucket.min + 0.01;
  return pct / 100 / width;
}

function expectedDensityAt(
  x: number,
  config: ExpectedDistributionConfig,
): number {
  if (config.type === "percentages" && config.percentages) {
    return bucketPercentDensity(x, config.percentages);
  }
  const mean = config.mean ?? 3.0;
  const sigma = config.sigma ?? 0.8;
  return normalPdf(x, mean, sigma);
}

function weightedMean(
  points: DistributionPoint[],
  key: "realDensity" | "expectedDensity",
): number {
  let weightSum = 0;
  let valueSum = 0;
  for (const p of points) {
    const w = p[key];
    weightSum += w;
    valueSum += p.x * w;
  }
  return weightSum > 0 ? valueSum / weightSum : 0;
}

export function buildDistribution(
  appraisals: Appraisal[],
  expectedConfig: ExpectedDistributionConfig = DEFAULT_EXPECTED,
): DistributionData {
  const ratings = appraisals.map((a) => a.finalRating);
  const bandwidth = silvermanBandwidth(ratings);
  const config = { ...DEFAULT_EXPECTED, ...expectedConfig };

  const points: DistributionPoint[] = [];
  for (let x = RATING_MIN; x <= RATING_MAX + CURVE_STEP / 2; x += CURVE_STEP) {
    const rounded = Math.round(x * 100) / 100;
    const realDensity = kde(ratings, rounded, bandwidth);
    const expectedDensity = expectedDensityAt(rounded, config);
    points.push({
      x: rounded,
      realDensity,
      expectedDensity,
      gap: realDensity - expectedDensity,
    });
  }

  const realMean =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r, 0) / ratings.length
      : 0;
  const expectedMean = weightedMean(points, "expectedDensity");
  const meanDeviation = realMean - expectedMean;

  return {
    points,
    meanDeviation,
    realMean,
    expectedMean,
  };
}
