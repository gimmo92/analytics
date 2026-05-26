import { MOCK_DEPARTMENTS } from "../data/mockAppraisalData";
import type { Appraisal, TeamHistogramBar, TeamHistogramData } from "../types";

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function buildTeamHistogram(appraisals: Appraisal[]): TeamHistogramData {
  const companyMean =
    appraisals.length > 0
      ? mean(appraisals.map((a) => a.finalRating))
      : 0;

  const byTeam = new Map<string, number[]>();
  for (const a of appraisals) {
    const list = byTeam.get(a.departmentId) ?? [];
    list.push(a.finalRating);
    byTeam.set(a.departmentId, list);
  }

  const teams: TeamHistogramBar[] = [];

  for (const team of MOCK_DEPARTMENTS) {
    const ratings = byTeam.get(team.id);
    if (!ratings?.length) continue;
    const average = mean(ratings);
    teams.push({
      teamId: team.id,
      teamName: team.name,
      average,
      sampleSize: ratings.length,
      diffFromCompanyMean: average - companyMean,
    });
  }

  return { teams, companyMean };
}

export type TeamHistogramSortMode = "averageDesc" | "alphabetical";

export function sortTeamHistogramBars(
  teams: TeamHistogramBar[],
  mode: TeamHistogramSortMode,
): TeamHistogramBar[] {
  const copy = [...teams];
  if (mode === "alphabetical") {
    copy.sort((a, b) => a.teamName.localeCompare(b.teamName, "it"));
  } else {
    copy.sort((a, b) => b.average - a.average);
  }
  return copy;
}
