import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ProjectStatus } from '../types/constructex';
import { StatusDistributionItem } from '../utils/projectStore';

interface ProjectStatusChartProps {
  distribution: StatusDistributionItem[];
  totalProjects: number;
  activeStatusFilter: 'All' | ProjectStatus;
  onSelectStatus: (status: 'All' | ProjectStatus) => void;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: StatusDistributionItem }>;
}

function StatusTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm text-xs">
      <p className="font-semibold text-slate-900">{item.name}</p>
      <p className="mt-1 font-mono text-slate-700 tabular-nums">
        {item.value} {item.value === 1 ? 'project' : 'projects'} ({item.percentage}%)
      </p>
      <p className="font-mono text-slate-500 tabular-nums">
        ${item.estimateCad.toLocaleString()} CAD
      </p>
    </div>
  );
}

export default function ProjectStatusChart({
  distribution,
  totalProjects,
  activeStatusFilter,
  onSelectStatus,
}: ProjectStatusChartProps) {
  const nonZeroData = distribution.filter((item) => item.value > 0);

  return (
    <section
      aria-label="Project status distribution chart"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Project Status Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live breakdown across stored projects. Click a status row or slice to filter the ledger below.
          </p>
        </div>
        {activeStatusFilter !== 'All' && (
          <button
            type="button"
            onClick={() => onSelectStatus('All')}
            className="text-xs font-semibold text-[#7C3AED] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Show All Statuses
          </button>
        )}
      </div>

      {totalProjects === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          Add project records to visualize status distribution.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Pie Chart Canvas */}
          <div className="md:col-span-5 h-[210px] w-full relative" data-testid="status-pie-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nonZeroData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={nonZeroData.length > 1 ? 3 : 0}
                  stroke="none"
                  onClick={(_data, index) => {
                    const clicked = nonZeroData[index];
                    if (!clicked) return;
                    const next = activeStatusFilter === clicked.name ? 'All' : clicked.name;
                    onSelectStatus(next);
                  }}
                  className="cursor-pointer outline-none"
                >
                  {nonZeroData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={
                        activeStatusFilter === 'All' || activeStatusFilter === entry.name
                          ? 1
                          : 0.35
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                {totalProjects}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {totalProjects === 1 ? 'project' : 'projects'}
              </span>
            </div>
          </div>

          {/* Interactive Legend & Breakdown */}
          <div className="md:col-span-7 divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {distribution.map((item) => {
              const isSelected = activeStatusFilter === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onSelectStatus(isSelected ? 'All' : item.name)}
                  aria-pressed={isSelected}
                  className={`w-full px-4 py-3.5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#7C3AED]/6' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 font-mono text-xs tabular-nums">
                    <span className="text-slate-600">
                      ${item.estimateCad.toLocaleString()} CAD
                    </span>
                    <span className="font-semibold text-slate-900 w-16 text-right">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
