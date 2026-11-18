import {
  GTA_CITIES,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  PortfolioStats,
  ProjectFilters,
  ProjectFormInput,
  ProjectRecord,
  ValidationResult,
} from '../types/constructex';

export const PROJECTS_STORAGE_KEY = 'constructex_projects_v1';

export const SEED_PROJECTS: ProjectRecord[] = [
  {
    id: 'prj-1001',
    title: 'Yorkville Penthouse Level-5 Skim',
    clientName: 'Harbourline Developments',
    city: 'Toronto',
    category: 'Level-5 Finishing',
    squareFootage: 4800,
    estimateAmount: 28400,
    status: 'In Progress',
    targetDate: '2026-12-08',
    notes: 'Full shadow-gap recessed ceiling coffers and 3-coat Level-5 skim finish.',
    createdAt: '2026-11-02T09:15:00.000Z',
    updatedAt: '2026-11-14T16:30:00.000Z',
  },
  {
    id: 'prj-1002',
    title: 'King West Acoustic Suite Partitioning',
    clientName: 'Northbridge Commercial Corp.',
    city: 'Toronto',
    category: 'Acoustic Systems',
    squareFootage: 6250,
    estimateAmount: 41900,
    status: 'Pending Quote',
    targetDate: '2026-12-19',
    notes: 'STC-54 double-stud steel framing with Roxul mineral wool sound attenuation.',
    createdAt: '2026-11-05T11:00:00.000Z',
    updatedAt: '2026-11-15T10:12:00.000Z',
  },
  {
    id: 'prj-1003',
    title: 'Bridle Path Custom Residence Drywall',
    clientName: 'Sovereign Estate Builders',
    city: 'Toronto',
    category: 'Luxury Residential',
    squareFootage: 9400,
    estimateAmount: 64500,
    status: 'In Progress',
    targetDate: '2027-01-15',
    notes: '5/8" Type-X fire-rated board, curved stairwell bulkhead, and gallery cove.',
    createdAt: '2026-10-20T08:40:00.000Z',
    updatedAt: '2026-11-16T14:05:00.000Z',
  },
  {
    id: 'prj-1004',
    title: 'Port Credit Medical Clinic Framing',
    clientName: 'Lakeshore Health Partners',
    city: 'Mississauga',
    category: 'Commercial Framing',
    squareFootage: 3600,
    estimateAmount: 22800,
    status: 'Completed',
    targetDate: '2026-11-10',
    notes: '20-gauge structural steel studs, moisture-resistant greenboard in exam rooms.',
    createdAt: '2026-10-03T13:20:00.000Z',
    updatedAt: '2026-11-10T17:45:00.000Z',
  },
  {
    id: 'prj-1005',
    title: 'Vaughan Corporate Atrium Bulkheads',
    clientName: 'Vellore Property Group',
    city: 'Vaughan',
    category: 'Commercial Framing',
    squareFootage: 5100,
    estimateAmount: 35200,
    status: 'Pending Quote',
    targetDate: '2027-01-28',
    notes: 'Multi-tier suspended linear light pockets and fire-rated shaft wall.',
    createdAt: '2026-11-11T15:10:00.000Z',
    updatedAt: '2026-11-17T09:20:00.000Z',
  },
  {
    id: 'prj-1006',
    title: 'Oakville Waterfront Gallery Walls',
    clientName: 'M. & C. Halton',
    city: 'Oakville',
    category: 'Luxury Residential',
    squareFootage: 3150,
    estimateAmount: 19600,
    status: 'Completed',
    targetDate: '2026-10-29',
    notes: 'Museum-grade flush baseboards with Fry Reglet aluminum reveal trim.',
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-10-29T16:00:00.000Z',
  },
];

export const DEFAULT_FILTERS: ProjectFilters = {
  query: '',
  category: 'All',
  status: 'All',
  city: 'All',
  sortField: 'updatedAt',
  sortDirection: 'desc',
};

export function createEmptyProjectInput(): ProjectFormInput {
  return {
    title: '',
    clientName: '',
    city: 'Toronto',
    category: 'Luxury Residential',
    squareFootage: '',
    estimateAmount: '',
    status: 'Pending Quote',
    targetDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    notes: '',
  };
}

export function projectToFormInput(record: ProjectRecord): ProjectFormInput {
  return {
    title: record.title,
    clientName: record.clientName,
    city: record.city,
    category: record.category,
    squareFootage: String(record.squareFootage),
    estimateAmount: String(record.estimateAmount),
    status: record.status,
    targetDate: record.targetDate,
    notes: record.notes,
  };
}

function getSafeStorage(): Storage | null {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

export function loadProjects(storageOverride?: Storage | null): ProjectRecord[] {
  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (!storage) {
    return [...SEED_PROJECTS];
  }

  try {
    const raw = storage.getItem(PROJECTS_STORAGE_KEY);
    if (raw === null) {
      storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      return [...SEED_PROJECTS];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      return [...SEED_PROJECTS];
    }

    return parsed.map((item) => ({
      ...item,
      squareFootage: Number(item.squareFootage) || 0,
      estimateAmount: Number(item.estimateAmount) || 0,
    }));
  } catch {
    return [...SEED_PROJECTS];
  }
}

export function saveProjects(
  projects: ProjectRecord[],
  storageOverride?: Storage | null
): void {
  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (!storage) return;
  storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

export function resetToSeedProjects(storageOverride?: Storage | null): ProjectRecord[] {
  const seeded = [...SEED_PROJECTS];
  saveProjects(seeded, storageOverride);
  return seeded;
}

export function validateProjectInput(
  input: ProjectFormInput,
  existingProjects: ProjectRecord[],
  editingId?: string | null
): ValidationResult {
  const errors: Partial<Record<keyof ProjectFormInput, string>> = {};

  const trimmedTitle = input.title.trim();
  const trimmedClient = input.clientName.trim();
  const sqFt = Number(input.squareFootage);
  const estimate = Number(input.estimateAmount);

  if (trimmedTitle.length < 3) {
    errors.title = 'Enter a project title (at least 3 characters).';
  }
  if (trimmedClient.length < 2) {
    errors.clientName = 'Enter a client or builder name.';
  }
  if (!GTA_CITIES.some((c) => c === input.city)) {
    errors.city = 'Select a valid GTA municipality.';
  }
  if (!PROJECT_CATEGORIES.some((cat) => cat === input.category)) {
    errors.category = 'Select a valid project category.';
  }
  if (!PROJECT_STATUSES.some((st) => st === input.status)) {
    errors.status = 'Select a valid project status.';
  }
  if (!Number.isFinite(sqFt) || sqFt <= 0) {
    errors.squareFootage = 'Square footage must be greater than 0.';
  }
  if (!Number.isFinite(estimate) || estimate <= 0) {
    errors.estimateAmount = 'Estimate amount (CAD) must be greater than 0.';
  }
  if (!input.targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.targetDate)) {
    errors.targetDate = 'Choose a valid target date.';
  }

  // Use Array.prototype.every() to verify all required checks passed
  const requiredChecks = [
    !errors.title,
    !errors.clientName,
    !errors.city,
    !errors.category,
    !errors.status,
    !errors.squareFootage,
    !errors.estimateAmount,
    !errors.targetDate,
  ];
  const isValid = requiredChecks.every(Boolean);

  // Use Array.prototype.some() to check for matching project titles
  const duplicateExists =
    trimmedTitle.length >= 3 &&
    existingProjects.some(
      (p) =>
        p.id !== editingId &&
        p.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );

  return {
    isValid,
    errors,
    duplicateWarning: duplicateExists
      ? 'A project with this exact title already exists in your ledger.'
      : null,
  };
}

export function createProject(
  projects: ProjectRecord[],
  input: ProjectFormInput,
  storageOverride?: Storage | null
): { projects: ProjectRecord[]; created: ProjectRecord } {
  const now = new Date().toISOString();
  const created: ProjectRecord = {
    id: `prj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title: input.title.trim(),
    clientName: input.clientName.trim(),
    city: input.city,
    category: input.category,
    squareFootage: Math.round(Number(input.squareFootage)),
    estimateAmount: Math.round(Number(input.estimateAmount)),
    status: input.status,
    targetDate: input.targetDate,
    notes: input.notes.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const next = [created, ...projects];
  saveProjects(next, storageOverride);
  return { projects: next, created };
}

export function findProjectById(
  projects: ProjectRecord[],
  id: string
): ProjectRecord | undefined {
  return projects.find((project) => project.id === id);
}

export function updateProject(
  projects: ProjectRecord[],
  id: string,
  input: ProjectFormInput,
  storageOverride?: Storage | null
): { projects: ProjectRecord[]; updated: ProjectRecord | null } {
  const existing = findProjectById(projects, id);
  if (!existing) {
    return { projects, updated: null };
  }

  const updatedRecord: ProjectRecord = {
    ...existing,
    title: input.title.trim(),
    clientName: input.clientName.trim(),
    city: input.city,
    category: input.category,
    squareFootage: Math.round(Number(input.squareFootage)),
    estimateAmount: Math.round(Number(input.estimateAmount)),
    status: input.status,
    targetDate: input.targetDate,
    notes: input.notes.trim(),
    updatedAt: new Date().toISOString(),
  };

  const next = projects.map((project) =>
    project.id === id ? updatedRecord : project
  );
  saveProjects(next, storageOverride);
  return { projects: next, updated: updatedRecord };
}

export function deleteProject(
  projects: ProjectRecord[],
  id: string,
  storageOverride?: Storage | null
): ProjectRecord[] {
  const next = projects.filter((project) => project.id !== id);
  saveProjects(next, storageOverride);
  return next;
}

export function filterAndSortProjects(
  projects: ProjectRecord[],
  filters: ProjectFilters
): ProjectRecord[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    const matchesCategory =
      filters.category === 'All' || project.category === filters.category;
    const matchesStatus =
      filters.status === 'All' || project.status === filters.status;
    const matchesCity = filters.city === 'All' || project.city === filters.city;

    if (!matchesCategory || !matchesStatus || !matchesCity) {
      return false;
    }

    if (!query) {
      return true;
    }

    // Use Array.prototype.some() across searchable project attributes
    const searchableFields = [
      project.title,
      project.clientName,
      project.city,
      project.category,
      project.status,
      project.notes,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(query));
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = filters.sortDirection === 'asc' ? 1 : -1;
    switch (filters.sortField) {
      case 'estimateAmount':
        return (a.estimateAmount - b.estimateAmount) * dir;
      case 'squareFootage':
        return (a.squareFootage - b.squareFootage) * dir;
      case 'title':
        return a.title.localeCompare(b.title) * dir;
      case 'updatedAt':
      default:
        return (
          (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
          dir
        );
    }
  });

  return sorted;
}

export function computePortfolioStats(projects: ProjectRecord[]): PortfolioStats {
  const activeCount = projects.filter((p) => p.status === 'In Progress').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const pendingCount = projects.filter((p) => p.status === 'Pending Quote').length;

  const totalEstimateCad = projects
    .map((p) => p.estimateAmount)
    .reduce((acc, val) => acc + val, 0);

  const totalSquareFeet = projects
    .map((p) => p.squareFootage)
    .reduce((acc, val) => acc + val, 0);

  return {
    totalProjects: projects.length,
    activeCount,
    completedCount,
    pendingCount,
    totalEstimateCad,
    totalSquareFeet,
  };
}

export interface StatusDistributionItem {
  name: ProjectRecord['status'];
  value: number;
  percentage: number;
  estimateCad: number;
  color: string;
}

const STATUS_CHART_COLORS: Record<ProjectRecord['status'], string> = {
  'Pending Quote': '#D97706',
  'In Progress': '#7C3AED',
  Completed: '#059669',
};

export function computeStatusDistribution(
  projects: ProjectRecord[]
): StatusDistributionItem[] {
  const total = projects.length;
  return PROJECT_STATUSES.map((status) => {
    const matching = projects.filter((p) => p.status === status);
    const count = matching.length;
    const estimateCad = matching
      .map((p) => p.estimateAmount)
      .reduce((acc, val) => acc + val, 0);
    return {
      name: status,
      value: count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      estimateCad,
      color: STATUS_CHART_COLORS[status],
    };
  });
}

