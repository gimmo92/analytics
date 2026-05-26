import type {
  Appraisal,
  NineBoxCell,
  NineBoxData,
  NineBoxPlacement,
  NineBoxTier,
} from "../types";

const CELL_LABELS: Record<string, string> = {
  "1-1": "Rischio",
  "1-2": "Efficiente",
  "1-3": "Affidabile",
  "2-1": "Dilemma",
  "2-2": "Core",
  "2-3": "Alto performer",
  "3-1": "Enigma",
  "3-2": "Talento in crescita",
  "3-3": "Stella",
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

function cellKey(perf: NineBoxTier, pot: NineBoxTier): string {
  return `${perf}-${pot}`;
}

export function buildNineBox(appraisals: Appraisal[]): NineBoxData {
  const performances = appraisals.map((a) => a.finalRating);
  const potentials = appraisals.map((a) => a.potentialRating);
  const perfThresholds = thresholds(performances);
  const potThresholds = thresholds(potentials);

  const placements: NineBoxPlacement[] = appraisals.map((a) => {
    const performanceTier = toTier(a.finalRating, perfThresholds);
    const potentialTier = toTier(a.potentialRating, potThresholds);
    return {
      appraisalId: a.id,
      employeeId: a.employeeId,
      employeeName: a.employeeName,
      performance: a.finalRating,
      potential: a.potentialRating,
      performanceTier,
      potentialTier,
    };
  });

  const cells: NineBoxCell[] = [];

  for (let pot: NineBoxTier = 3; pot >= 1; pot = (pot - 1) as NineBoxTier) {
    for (let perf: NineBoxTier = 1; perf <= 3; perf = (perf + 1) as NineBoxTier) {
      const employees = placements.filter(
        (p) => p.performanceTier === perf && p.potentialTier === pot,
      );
      cells.push({
        performanceTier: perf,
        potentialTier: pot,
        label: CELL_LABELS[cellKey(perf, pot)] ?? "",
        count: employees.length,
        percentage:
          appraisals.length > 0
            ? (employees.length / appraisals.length) * 100
            : 0,
        employees,
      });
    }
  }

  return {
    cells,
    total: appraisals.length,
    performanceThresholds: perfThresholds,
    potentialThresholds: potThresholds,
  };
}

/** Intensità colore: più “star” = verde, basso-basso = rosso */
export function nineBoxCellColor(
  performanceTier: NineBoxTier,
  potentialTier: NineBoxTier,
  count: number,
): string {
  if (count === 0) return "var(--color-bg-page)";
  const score = performanceTier + potentialTier;
  if (score >= 5) return "#bbf7d0";
  if (score >= 4) return "#dcfce7";
  if (score === 3) return "#fef9c3";
  if (score === 2) return "#ffedd5";
  return "#fee2e2";
}
