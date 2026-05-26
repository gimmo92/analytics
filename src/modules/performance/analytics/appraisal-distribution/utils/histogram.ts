import type { Appraisal } from "../types";
import {
  RATING_BIN_SIZE,
  RATING_MAX,
  RATING_MIN,
  type HistogramBin,
  type HistogramData,
} from "../types";

export function buildHistogram(appraisals: Appraisal[]): HistogramData {
  const ratings = appraisals.map((a) => a.finalRating);
  const total = ratings.length;

  if (total === 0) {
    return { bins: [], mean: 0, total: 0 };
  }

  const bins: HistogramBin[] = [];
  for (let start = RATING_MIN; start < RATING_MAX; start += RATING_BIN_SIZE) {
    const end = Math.min(
      RATING_MAX,
      Math.round((start + RATING_BIN_SIZE) * 100) / 100,
    );
    const count = ratings.filter(
      (r) =>
        r >= start - 0.001 &&
        (end >= RATING_MAX ? r <= RATING_MAX + 0.001 : r < end),
    ).length;

    bins.push({
      binStart: start,
      binEnd: end,
      binLabel: `${start.toFixed(2)}–${end === RATING_MAX ? "5.00" : end.toFixed(2)}`,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    });
  }

  const mean =
    ratings.reduce((sum, r) => sum + r, 0) / total;

  return { bins, mean, total };
}

/** Interpolazione colore rosso → giallo → verde per rating 1–5 */
export function ratingToColor(rating: number): string {
  const t = (rating - RATING_MIN) / (RATING_MAX - RATING_MIN);
  if (t <= 0.5) {
    const local = t / 0.5;
    const r = Math.round(220 + (245 - 220) * local);
    const g = Math.round(38 + (158 - 38) * local);
    const b = Math.round(38 + (11 - 38) * local);
    return `rgb(${r}, ${g}, ${b})`;
  }
  const local = (t - 0.5) / 0.5;
  const r = Math.round(245 + (22 - 245) * local);
  const g = Math.round(158 + (163 - 158) * local);
  const b = Math.round(11 + (74 - 11) * local);
  return `rgb(${r}, ${g}, ${b})`;
}

export function binMidpoint(bin: HistogramBin): number {
  return (bin.binStart + bin.binEnd) / 2;
}
