import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FILTERS,
  SEED_PROJECTS,
  computePortfolioStats,
  computeStatusDistribution,
  createEmptyProjectInput,
  createProject,
  deleteProject,
  filterAndSortProjects,
  findProjectById,
  loadProjects,
  updateProject,
  validateProjectInput,
} from './projectStore';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

test('loadProjects seeds initial records into Local Storage when empty', () => {
  const storage = createMemoryStorage();
  const projects = loadProjects(storage);
  assert.equal(projects.length, SEED_PROJECTS.length);
  assert.ok(storage.getItem('constructex_projects_v1') !== null);
});

test('CRUD lifecycle: create, find, update, delete persist to Local Storage', () => {
  const storage = createMemoryStorage();
  let projects = loadProjects(storage);
  const initialCount = projects.length;

  const input = {
    ...createEmptyProjectInput(),
    title: 'Rosedale Townhouse Coffered Ceilings',
    clientName: 'Bespoke Homes Toronto',
    city: 'Toronto' as const,
    category: 'Level-5 Finishing' as const,
    squareFootage: '2800',
    estimateAmount: '17500',
    status: 'In Progress' as const,
  };

  const validation = validateProjectInput(input, projects);
  assert.equal(validation.isValid, true);

  const createdRes = createProject(projects, input, storage);
  projects = createdRes.projects;
  assert.equal(projects.length, initialCount + 1);

  // Reload from storage and verify persistence
  const reloaded = loadProjects(storage);
  const found = findProjectById(reloaded, createdRes.created.id);
  assert.ok(found);
  assert.equal(found.title, 'Rosedale Townhouse Coffered Ceilings');
  assert.equal(found.estimateAmount, 17500);

  // Update record
  const updatedRes = updateProject(
    reloaded,
    createdRes.created.id,
    {
      ...input,
      status: 'Completed',
      estimateAmount: '18900',
    },
    storage
  );
  assert.ok(updatedRes.updated);
  assert.equal(updatedRes.updated.status, 'Completed');
  assert.equal(updatedRes.updated.estimateAmount, 18900);

  // Delete record
  const afterDelete = deleteProject(updatedRes.projects, createdRes.created.id, storage);
  assert.equal(afterDelete.length, initialCount);
  assert.equal(findProjectById(loadProjects(storage), createdRes.created.id), undefined);
});

test('validateProjectInput rejects empty fields and detects duplicates', () => {
  const empty = createEmptyProjectInput();
  const invalidRes = validateProjectInput(empty, SEED_PROJECTS);
  assert.equal(invalidRes.isValid, false);
  assert.ok(invalidRes.errors.title);
  assert.ok(invalidRes.errors.clientName);
  assert.ok(invalidRes.errors.squareFootage);

  const duplicateInput = {
    ...createEmptyProjectInput(),
    title: SEED_PROJECTS[0].title,
    clientName: 'New Client',
    squareFootage: '1500',
    estimateAmount: '9000',
  };
  const dupRes = validateProjectInput(duplicateInput, SEED_PROJECTS);
  assert.equal(dupRes.isValid, true);
  assert.ok(dupRes.duplicateWarning !== null);
});

test('filterAndSortProjects filters by query, category, status, city and sorts cleanly', () => {
  const byQuery = filterAndSortProjects(SEED_PROJECTS, {
    ...DEFAULT_FILTERS,
    query: 'Yorkville',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, 'prj-1001');

  const byCityAndStatus = filterAndSortProjects(SEED_PROJECTS, {
    ...DEFAULT_FILTERS,
    city: 'Mississauga',
    status: 'Completed',
  });
  assert.equal(byCityAndStatus.length, 1);
  assert.equal(byCityAndStatus[0].id, 'prj-1004');

  const sortedByAmountDesc = filterAndSortProjects(SEED_PROJECTS, {
    ...DEFAULT_FILTERS,
    sortField: 'estimateAmount',
    sortDirection: 'desc',
  });
  assert.ok(sortedByAmountDesc[0].estimateAmount >= sortedByAmountDesc[1].estimateAmount);
});

test('computePortfolioStats totals values accurately', () => {
  const stats = computePortfolioStats(SEED_PROJECTS);
  assert.equal(stats.totalProjects, 6);
  assert.equal(stats.activeCount, 2);
  assert.equal(stats.completedCount, 2);
  assert.equal(stats.pendingCount, 2);
  assert.equal(stats.totalEstimateCad, 212400);
  assert.equal(stats.totalSquareFeet, 32300);
});

test('computeStatusDistribution computes counts, percentages, and CAD totals per status', () => {
  const dist = computeStatusDistribution(SEED_PROJECTS);
  assert.equal(dist.length, 3);
  const pending = dist.find((d) => d.name === 'Pending Quote');
  const inProgress = dist.find((d) => d.name === 'In Progress');
  const completed = dist.find((d) => d.name === 'Completed');
  assert.equal(pending?.value, 2);
  assert.equal(pending?.percentage, 33);
  assert.equal(inProgress?.value, 2);
  assert.equal(completed?.value, 2);

  const emptyDist = computeStatusDistribution([]);
  assert.equal(emptyDist.every((d) => d.value === 0 && d.percentage === 0), true);
});

