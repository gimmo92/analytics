import type {
  Appraisal,
  AppraisalCycle,
  Department,
  Manager,
} from "../types";

export const MOCK_CYCLES: AppraisalCycle[] = [
  {
    id: "cycle-2025-h1",
    name: "H1 2025",
    status: "closed",
    closedAt: "2025-07-15",
  },
  {
    id: "cycle-2024-h2",
    name: "H2 2024",
    status: "closed",
    closedAt: "2025-01-20",
  },
  {
    id: "cycle-2025-h2",
    name: "H2 2025",
    status: "open",
  },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: "dept-eng", name: "Engineering" },
  { id: "dept-product", name: "Product" },
  { id: "dept-sales", name: "Sales" },
  { id: "dept-marketing", name: "Marketing" },
  { id: "dept-hr", name: "People & HR" },
  { id: "dept-finance", name: "Finance" },
  { id: "dept-ops", name: "Operations" },
  { id: "dept-cs", name: "Customer Success" },
];

const MANAGER_NAMES = [
  "Alessandro Rossi",
  "Giulia Bianchi",
  "Marco Ferrari",
  "Sara Colombo",
  "Luca Romano",
  "Elena Ricci",
  "Andrea Marino",
  "Francesca Greco",
  "Davide Bruno",
  "Chiara Gallo",
  "Matteo Conti",
  "Valentina Costa",
  "Simone Fontana",
  "Federica Moretti",
  "Paolo Barbieri",
];

export const MOCK_MANAGERS: Manager[] = MANAGER_NAMES.map((name, index) => ({
  id: `mgr-${index + 1}`,
  name,
  departmentId: MOCK_DEPARTMENTS[index % MOCK_DEPARTMENTS.length].id,
}));

const EMPLOYEE_FIRST = [
  "Marco",
  "Giulia",
  "Luca",
  "Sara",
  "Andrea",
  "Elena",
  "Matteo",
  "Chiara",
  "Davide",
  "Francesca",
];

const EMPLOYEE_LAST = [
  "Rossi",
  "Bianchi",
  "Ferrari",
  "Romano",
  "Colombo",
  "Ricci",
  "Marino",
  "Greco",
  "Bruno",
  "Gallo",
];

/** Box-Muller: rating sbilanciato verso l'alto (media ~3.6, σ ~0.7) */
function sampleRating(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z =
    Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const raw = 3.6 + z * 0.7;
  const clamped = Math.min(5, Math.max(1, raw));
  return Math.round(clamped * 4) / 4;
}

/** Potenziale correlato ma non identico alla performance */
function samplePotential(performance: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z =
    Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const raw = performance * 0.55 + 2.0 + z * 0.65;
  const clamped = Math.min(5, Math.max(1, raw));
  return Math.round(clamped * 4) / 4;
}

function employeeName(index: number): string {
  const first = EMPLOYEE_FIRST[index % EMPLOYEE_FIRST.length];
  const last = EMPLOYEE_LAST[Math.floor(index / EMPLOYEE_FIRST.length) % EMPLOYEE_LAST.length];
  return `${first} ${last}`;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateAppraisals(): Appraisal[] {
  const appraisals: Appraisal[] = [];
  const statuses: Appraisal["status"][] = [
    "completed",
    "completed",
    "completed",
    "completed",
    "in_progress",
    "draft",
  ];

  for (let i = 0; i < 200; i++) {
    const manager = pick(MOCK_MANAGERS);
    const cycle = i < 140 ? MOCK_CYCLES[0] : MOCK_CYCLES[1];
    const finalRating = sampleRating();
    appraisals.push({
      id: `apr-${i + 1}`,
      employeeId: `emp-${i + 1}`,
      employeeName: employeeName(i),
      cycleId: cycle.id,
      departmentId: manager.departmentId,
      managerId: manager.id,
      finalRating,
      potentialRating: samplePotential(finalRating),
      status: pick(statuses),
    });
  }

  return appraisals;
}

export const MOCK_APPRAISALS: Appraisal[] = generateAppraisals();

export function getDefaultClosedCycleId(): string {
  const closed = MOCK_CYCLES.filter((c) => c.status === "closed").sort(
    (a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? ""),
  );
  return closed[0]?.id ?? MOCK_CYCLES[0].id;
}
