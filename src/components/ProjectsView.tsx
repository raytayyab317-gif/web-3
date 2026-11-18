import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  GTA_CITIES,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  PortfolioStats,
  ProjectFilters,
  ProjectFormInput,
  ProjectRecord,
  ProjectStatus,
  SortDirection,
  SortField,
} from '../types/constructex';
import {
  DEFAULT_FILTERS,
  computeStatusDistribution,
  createEmptyProjectInput,
  filterAndSortProjects,
  findProjectById,
  projectToFormInput,
  validateProjectInput,
} from '../utils/projectStore';
import ProjectStatusChart from './ProjectStatusChart';

interface ProjectsViewProps {
  projects: ProjectRecord[];
  stats: PortfolioStats;
  onCreate: (input: ProjectFormInput) => ProjectRecord;
  onUpdate: (id: string, input: ProjectFormInput) => void;
  onDelete: (id: string) => void;
  onRestoreDeleted: (record: ProjectRecord) => void;
  onResetSamples: () => void;
}

function StatusLabel({ status }: { status: ProjectStatus }) {
  if (status === 'Completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        {status}
      </span>
    );
  }
  if (status === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C3AED] whitespace-nowrap">
        <Clock3 className="w-3.5 h-3.5 shrink-0" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {status}
    </span>
  );
}

export default function ProjectsView({
  projects,
  stats,
  onCreate,
  onUpdate,
  onDelete,
  onRestoreDeleted,
  onResetSamples,
}: ProjectsViewProps) {
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInput, setFormInput] = useState<ProjectFormInput>(createEmptyProjectInput);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [recentlyDeleted, setRecentlyDeleted] = useState<ProjectRecord | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () => filterAndSortProjects(projects, filters),
    [projects, filters]
  );

  const statusDistribution = useMemo(
    () => computeStatusDistribution(projects),
    [projects]
  );

  const validation = useMemo(
    () => validateProjectInput(formInput, projects, editingId),
    [formInput, projects, editingId]
  );

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.city !== 'All';

  const openCreateForm = () => {
    setEditingId(null);
    setFormInput(createEmptyProjectInput());
    setSubmittedAttempt(false);
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const target = findProjectById(projects, id);
    if (!target) return;
    setEditingId(target.id);
    setFormInput(projectToFormInput(target));
    setSubmittedAttempt(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setSubmittedAttempt(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);
    if (!validation.isValid) return;

    if (editingId) {
      onUpdate(editingId, formInput);
      setBannerMessage(`Updated "${formInput.title.trim()}" and saved to Local Storage.`);
    } else {
      const created = onCreate(formInput);
      setBannerMessage(`Added "${created.title}" to Local Storage.`);
    }
    setRecentlyDeleted(null);
    closeForm();
  };

  const handleDeleteClick = (record: ProjectRecord) => {
    if (editingId === record.id) {
      closeForm();
    }
    onDelete(record.id);
    setRecentlyDeleted(record);
    setBannerMessage(null);
  };

  const handleUndoDelete = () => {
    if (!recentlyDeleted) return;
    onRestoreDeleted(recentlyDeleted);
    setBannerMessage(`Restored "${recentlyDeleted.title}".`);
    setRecentlyDeleted(null);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <section className="pt-24 pb-20 px-6 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#7C3AED] mb-2">
              Project Operations · Local Storage Ledger
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              GTA Drywall Estimates & Active Jobs
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Create, edit, search, and filter client drywall estimates. All records persist automatically in browser Local Storage across page reloads.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onResetSamples}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Samples
            </button>
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Portfolio Summary Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Total Estimates Value</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              ${stats.totalEstimateCad.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">CAD</span>
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Active & Pending Jobs</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              {stats.activeCount + stats.pendingCount}
              <span className="text-xs font-normal text-slate-500 ml-1.5">
                of {stats.totalProjects}
              </span>
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Total Drywall Area</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              {stats.totalSquareFeet.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">sq ft</span>
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Completed Projects</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
              {stats.completedCount}
              <span className="text-xs font-normal text-slate-500 ml-1.5">
                delivered
              </span>
            </p>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <ProjectStatusChart
          distribution={statusDistribution}
          totalProjects={projects.length}
          activeStatusFilter={filters.status}
          onSelectStatus={(status) =>
            setFilters((prev) => ({ ...prev, status }))
          }
        />

        {/* Feedback & Undo Banners */}
        {recentlyDeleted && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800"
          >
            <span>
              Deleted <strong>{recentlyDeleted.title}</strong> from Local Storage.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUndoDelete}
                className="font-semibold text-[#7C3AED] hover:underline cursor-pointer"
              >
                Undo Delete
              </button>
              <button
                type="button"
                onClick={() => setRecentlyDeleted(null)}
                aria-label="Dismiss delete notice"
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {bannerMessage && (
          <div
            role="status"
            className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-900"
          >
            <span className="font-medium">{bannerMessage}</span>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              aria-label="Dismiss status message"
              className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Create / Edit Project Form Panel */}
        {isFormOpen && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  {editingId ? 'Edit Project Record' : 'Create New Project Estimate'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All required fields are validated before saving to Local Storage.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close project form"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {validation.duplicateWarning && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
                Note: {validation.duplicateWarning}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="project-title"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Project Title *
                  </label>
                  <input
                    id="project-title"
                    type="text"
                    value={formInput.title}
                    onChange={(e) =>
                      setFormInput((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Forest Hill Custom Drywall"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  />
                  {submittedAttempt && validation.errors.title && (
                    <p className="mt-1 text-xs text-rose-600">{validation.errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="project-client"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Client / Builder Name *
                  </label>
                  <input
                    id="project-client"
                    type="text"
                    value={formInput.clientName}
                    onChange={(e) =>
                      setFormInput((prev) => ({ ...prev, clientName: e.target.value }))
                    }
                    placeholder="e.g. Oakridge Custom Homes"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  />
                  {submittedAttempt && validation.errors.clientName && (
                    <p className="mt-1 text-xs text-rose-600">
                      {validation.errors.clientName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="project-city"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    GTA Municipality *
                  </label>
                  <select
                    id="project-city"
                    value={formInput.city}
                    onChange={(e) =>
                      setFormInput((prev) => ({
                        ...prev,
                        city: e.target.value as ProjectFormInput['city'],
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  >
                    {GTA_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="project-category"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Scope Category *
                  </label>
                  <select
                    id="project-category"
                    value={formInput.category}
                    onChange={(e) =>
                      setFormInput((prev) => ({
                        ...prev,
                        category: e.target.value as ProjectFormInput['category'],
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  >
                    {PROJECT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="project-sqft"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Area (Square Feet) *
                  </label>
                  <input
                    id="project-sqft"
                    type="number"
                    min="1"
                    value={formInput.squareFootage}
                    onChange={(e) =>
                      setFormInput((prev) => ({
                        ...prev,
                        squareFootage: e.target.value,
                      }))
                    }
                    placeholder="e.g. 3200"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  />
                  {submittedAttempt && validation.errors.squareFootage && (
                    <p className="mt-1 text-xs text-rose-600">
                      {validation.errors.squareFootage}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="project-estimate"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Estimate Amount (CAD) *
                  </label>
                  <input
                    id="project-estimate"
                    type="number"
                    min="1"
                    value={formInput.estimateAmount}
                    onChange={(e) =>
                      setFormInput((prev) => ({
                        ...prev,
                        estimateAmount: e.target.value,
                      }))
                    }
                    placeholder="e.g. 19500"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  />
                  {submittedAttempt && validation.errors.estimateAmount && (
                    <p className="mt-1 text-xs text-rose-600">
                      {validation.errors.estimateAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="project-status"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Project Status *
                  </label>
                  <select
                    id="project-status"
                    value={formInput.status}
                    onChange={(e) =>
                      setFormInput((prev) => ({
                        ...prev,
                        status: e.target.value as ProjectFormInput['status'],
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="project-date"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Target Completion Date *
                  </label>
                  <input
                    id="project-date"
                    type="date"
                    value={formInput.targetDate}
                    onChange={(e) =>
                      setFormInput((prev) => ({ ...prev, targetDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  />
                  {submittedAttempt && validation.errors.targetDate && (
                    <p className="mt-1 text-xs text-rose-600">
                      {validation.errors.targetDate}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="project-notes"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Specification Notes
                </label>
                <textarea
                  id="project-notes"
                  rows={2}
                  value={formInput.notes}
                  onChange={(e) =>
                    setFormInput((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Board thickness, Level-5 skim details, acoustic insulation specs..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Add Project Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <label htmlFor="project-search" className="sr-only">
                Search projects
              </label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="project-search"
                type="search"
                value={filters.query}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                placeholder="Search title, client, GTA city, or notes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <label htmlFor="filter-category" className="sr-only">
                Filter by category
              </label>
              <select
                id="filter-category"
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value as ProjectFilters['category'],
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="All">All Categories</option>
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* City Select */}
            <div className="md:col-span-2">
              <label htmlFor="filter-city" className="sr-only">
                Filter by GTA city
              </label>
              <select
                id="filter-city"
                value={filters.city}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    city: e.target.value as ProjectFilters['city'],
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="All">All GTA Cities</option>
                {GTA_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-2">
              <label htmlFor="sort-projects" className="sr-only">
                Sort projects
              </label>
              <select
                id="sort-projects"
                value={`${filters.sortField}:${filters.sortDirection}`}
                onChange={(e) => {
                  const [sortField, sortDirection] = e.target.value.split(':') as [
                    SortField,
                    SortDirection,
                  ];
                  setFilters((prev) => ({ ...prev, sortField, sortDirection }));
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:border-[#7C3AED] focus:outline-none"
              >
                <option value="updatedAt:desc">Newest Updated</option>
                <option value="estimateAmount:desc">Highest Estimate</option>
                <option value="estimateAmount:asc">Lowest Estimate</option>
                <option value="squareFootage:desc">Largest Area</option>
                <option value="title:asc">Title A–Z</option>
              </select>
            </div>
          </div>

          {/* Interactive Status Segmented Tabs + Match Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div
              role="group"
              aria-label="Filter by project status"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
            >
              {(['All', ...PROJECT_STATUSES] as const).map((statusOption) => {
                const active = filters.status === statusOption;
                return (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, status: statusOption }))
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {statusOption === 'All' ? 'All Statuses' : statusOption}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="tabular-nums">
                Showing <strong className="text-slate-900">{visibleProjects.length}</strong>{' '}
                of {projects.length} records
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="font-semibold text-[#7C3AED] hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Records Display (Populated, Empty Filter, or Empty Store) */}
        {projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <h2 className="font-display text-lg font-bold text-slate-900">
              No project estimates stored yet
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
              Add your first drywall or framing estimate to persist it in Local Storage, or restore the sample GTA project records.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={openCreateForm}
                className="px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold cursor-pointer"
              >
                Create First Project
              </button>
              <button
                type="button"
                onClick={onResetSamples}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold cursor-pointer"
              >
                Load Sample Projects
              </button>
            </div>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <h2 className="font-display text-lg font-bold text-slate-900">
              No matching records found
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Adjust your search keywords or category/status filters to see stored projects.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-5">Project & Client</th>
                    <th className="py-3.5 px-4">Scope & Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Area (sq ft)</th>
                    <th className="py-3.5 px-4 text-right">Estimate (CAD)</th>
                    <th className="py-3.5 px-4">Target Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {visibleProjects.map((project) => (
                    <tr
                      key={project.id}
                      data-testid="project-row"
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-5 max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">
                          {project.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {project.clientName}
                          {project.notes ? ` · ${project.notes}` : ''}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                        <span className="font-medium text-slate-800">
                          {project.category}
                        </span>
                        <span className="mx-1.5 text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span>{project.city}</span>
                      </td>
                      <td className="py-4 px-4">
                        <StatusLabel status={project.status} />
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-800 tabular-nums whitespace-nowrap">
                        {project.squareFootage.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        ${project.estimateAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {project.targetDate}
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditForm(project.id)}
                            aria-label={`Edit ${project.title}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-[#7C3AED] hover:bg-[#7C3AED]/8 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(project)}
                            aria-label={`Delete ${project.title}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card List */}
            <div className="lg:hidden divide-y divide-slate-200">
              {visibleProjects.map((project) => (
                <article key={project.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{project.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {project.clientName} · {project.city} · {project.category}
                      </p>
                    </div>
                    <StatusLabel status={project.status} />
                  </div>

                  {project.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {project.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        ${project.estimateAmount.toLocaleString()} CAD
                      </span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {project.squareFootage.toLocaleString()} sq ft
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {project.targetDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(project.id)}
                        aria-label={`Edit ${project.title}`}
                        className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#7C3AED] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(project)}
                        aria-label={`Delete ${project.title}`}
                        className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
