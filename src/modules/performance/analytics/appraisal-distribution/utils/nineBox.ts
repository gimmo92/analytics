import type {
  Appraisal,
  NineBoxData,
  NineBoxQuadrant,
  NineBoxScatterPoint,
  NineBoxTier,
} from "../types";

/** Etichette quadranti come nel modello Spark (asse X = performance, Y = potenziale) */
const QUADRANT_LABELS: Record<string, string> = {
  "1-3": "Potenziale sprecato",
  "2-3": "Buon Potenziale",
  "3-3": "Grande Potenziale",
  "1-2": "Nella curva di apprendimento",
  "2-2": "Solido contributo",
  "3-2": "Buon potenziale",
  "1-1": "Caso Problematico",
  "2-1": "Prestazioni e potenziale sotto le aspettative",
  "3-1": "Alta prestazione",
};

const FIXED_P33 = 2.33;
const FIXED_P66 = 3.67;

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

function thresholds(values: number[]): { p33: number; p66: number } {
  if (values.length < 6) {
    return { p33: FIXED_P33, p66: FIXED_P66 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  return {
    p33: percentile(sorted, 1 / 3),
    p66: percentile(sorted, 2 / 3),
  };
}

function toTier(
  value: number,
  { p33, p66 }: { p33: number; p66: number },
): NineBoxTier {
  if (value <= p33) return 1;
  if (value <= p66) return 2;
  return 3;
}

function quadrantKey(perf: NineBoxTier, pot: NineBoxTier): string {
  return `${perf}-${pot}`;
}

/** Percentile rank 0–100 nel campione (posizione relativa) */
function toPercentileRank(value: number, values: number[]): number {
  if (values.length === 0) return 50;
  if (values.length === 1) return 50;
  const less = values.filter((v) => v < value).length;
  const equal = values.filter((v) => v === value).length;
  const rank = less + (equal - 1) / 2;
  return (rank / (values.length - 1)) * 100;
}

function hashOffset(id: string, channel: "x" | "y"): number {
  let hash = 0;
  const seed = channel === "x" ? 17 : 31;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * seed) % 1000;
  }
  return ((hash % 100) / 100 - 0.5) * 5;
}

/** Piccolo jitter per evitare sovrapposizione perfetta */
function applyScatterJitter(
  points: NineBoxScatterPoint[],
): NineBoxScatterPoint[] {
  const buckets = new Map<string, NineBoxScatterPoint[]>();

  for (const p of points) {
    const key = `${Math.round(p.performancePercent / 4)}-${Math.round(p.potentialPercent / 4)}`;
    const list = buckets.get(key) ?? [];
    list.push(p);
    buckets.set(key, list);
  }

  const result: NineBoxScatterPoint[] = [];

  for (const group of buckets.values()) {
    if (group.length === 1) {
      const p = group[0];
      result.push({
        ...p,
        performancePercent: clampPercent(
          p.performancePercent + hashOffset(p.employeeId, "x"),
        ),
        potentialPercent: clampPercent(
          p.potentialPercent + hashOffset(p.employeeId, "y"),
        ),
      });
      continue;
    }

    const radius = Math.min(6, 2 + group.length * 0.6);
    group.forEach((p, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      result.push({
        ...p,
        performancePercent: clampPercent(
          p.performancePercent + Math.cos(angle) * radius,
        ),
        potentialPercent: clampPercent(
          p.potentialPercent + Math.sin(angle) * radius,
        ),
      });
    });
  }

  return result;
}

function clampPercent(v: number): number {
  return Math.min(98, Math.max(2, v));
}

export function buildNineBox(appraisals: Appraisal[]): NineBoxData {
  const performances = appraisals.map((a) => a.finalRating);
  const potentials = appraisals.map((a) => a.potentialRating);
  const perfThresholds = thresholds(performances);
  const potThresholds = thresholds(potentials);

  const rawPoints: NineBoxScatterPoint[] = appraisals.map((a) => {
    const performanceTier = toTier(a.finalRating, perfThresholds);
    const potentialTier = toTier(a.potentialRating, potThresholds);
    return {
      appraisalId: a.id,
      employeeId: a.employeeId,
      employeeName: a.employeeName,
      performance: a.finalRating,
      potential: a.potentialRating,
      performancePercent: toPercentileRank(a.finalRating, performances),
      potentialPercent: toPercentileRank(a.potentialRating, potentials),
      performanceTier,
      potentialTier,
      quadrantLabel:
        QUADRANT_LABELS[quadrantKey(performanceTier, potentialTier)] ?? "",
    };
  });

  const points = applyScatterJitter(rawPoints);

  const quadrants: NineBoxQuadrant[] = [];
  for (let pot: NineBoxTier = 3; pot >= 1; pot = (pot - 1) as NineBoxTier) {
    for (let perf: NineBoxTier = 1; perf <= 3; perf = (perf + 1) as NineBoxTier) {
      const label = QUADRANT_LABELS[quadrantKey(perf, pot)] ?? "";
      quadrants.push({
        performanceTier: perf,
        potentialTier: pot,
        label,
        count: points.filter(
          (p) => p.performanceTier === perf && p.potentialTier === pot,
        ).length,
      });
    }
  }

  return {
    points,
    quadrants,
    total: appraisals.length,
  };
}

/** Centro % di un quadrante per etichetta */
export function quadrantLabelPosition(
  perfTier: NineBoxTier,
  potTier: NineBoxTier,
): { left: number; top: number } {
  const colCenter = (perfTier - 0.5) * (100 / 3);
  const rowFromTop = (potTier - 0.5) * (100 / 3);
  return {
    left: colCenter,
    top: 100 - rowFromTop,
  };
}
