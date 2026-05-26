import { MOCK_APPRAISALS } from "../data/mockAppraisalData";
import type { Appraisal, AppraisalAnalyticsFilters } from "../types";

export function filterAppraisals(
  filters: AppraisalAnalyticsFilters,
  source: Appraisal[] = MOCK_APPRAISALS,
): Appraisal[] {
  return source.filter((appraisal) => {
    if (appraisal.cycleId !== filters.cycleId) return false;
    if (
      filters.departmentIds.length > 0 &&
      !filters.departmentIds.includes(appraisal.departmentId)
    ) {
      return false;
    }
    if (
      filters.managerIds.length > 0 &&
      !filters.managerIds.includes(appraisal.managerId)
    ) {
      return false;
    }
    return true;
  });
}
