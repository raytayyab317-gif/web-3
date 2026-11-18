import { useState } from 'react';
import { ArrowRight, Building2, CloudSun, FolderKanban } from 'lucide-react';
import { PageRoute, PortfolioStats } from '../types/constructex';

interface HomeViewProps {
  stats: PortfolioStats;
  onNavigate: (route: PageRoute) => void;
}

const HERO_IMG = '/src/assets/images/hero_drywall_interior_1795027209601.jpg';
const COMMERCIAL_IMG = '/src/assets/images/commercial_acoustic_lobby_1795027210895.jpg';

export default function HomeView({ stats, onNavigate }: HomeViewProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [commercialImgFailed, setCommercialImgFailed] = useState(false);

  return (
    <div>
      {/* Hero Section preserving ConstructEx signature typography & visual presence */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex flex-col justify-center items-center overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none z-0">
          {!heroImgFailed ? (
            <img
              src={HERO_IMG}
              alt="Modern luxury Toronto interior with seamless Level-5 drywall ceilings"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-violet-50" />
          )}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[3px]" />
        </div>

        <div className="relative z-10 text-center px-6 py-20 max-w-5xl mx-auto">
          <p className="text-sm font-medium text-slate-600 mb-5">
            Greater Toronto Area · Established 2006
          </p>

          <h1 className="leading-[0.9] flex flex-col items-center text-balance">
            <span className="font-display font-extrabold text-6xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] block tracking-tighter text-slate-900">
              Dry Wall
            </span>
            <span className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-[6.75rem] block tracking-tight mt-2 text-[#7C3AED]">
              Experts
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Architectural steel framing, acoustic STC-54 partitions, and true Level-5 plaster finishes for luxury residential and commercial developments across Toronto.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="group inline-flex items-center gap-3 rounded-full font-semibold text-base transition-all duration-200 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-[0_10px_30px_rgba(124,58,237,0.28)] pl-7 pr-2.5 py-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
            >
              <span>Get an Estimate</span>
              <span className="flex items-center justify-center rounded-full bg-white w-10 h-10 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-slate-800 bg-white/90 border border-slate-200 hover:border-[#7C3AED]/40 hover:text-[#7C3AED] transition-colors cursor-pointer"
            >
              Open Project Ledger
            </button>
          </div>
        </div>

        <div className="absolute inset-0 noise-overlay pointer-events-none opacity-15 z-20" />
      </section>

      {/* Capabilities Asymmetric Bento Section */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-semibold text-[#7C3AED] mb-2">
                Core Capabilities
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                Engineered Interiors Built to Exact Tolerance
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Every project estimate, square footage scope, and field weather check is managed inside our integrated GTA operations workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wide showcase card */}
            <article className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col">
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-200 relative">
                {!commercialImgFailed ? (
                  <img
                    src={COMMERCIAL_IMG}
                    alt="Sculptural curved commercial drywall ceiling and acoustic lobby walls"
                    referrerPolicy="no-referrer"
                    onError={() => setCommercialImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-2">
                    <Building2 className="w-8 h-8 text-[#7C3AED]" />
                    <span className="text-sm font-medium">Commercial Acoustic Assemblies</span>
                  </div>
                )}
              </div>
              <div className="p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    01 · Commercial & Architectural Systems
                  </p>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Curved Bulkheads, Shadow-Gap Reveals & STC-54 Partitions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#7C3AED] bg-[#7C3AED]/8 hover:bg-[#7C3AED]/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Inspect Active Jobs
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>

            {/* Operational Workspace & Weather Launchers */}
            <div className="flex flex-col gap-6">
              <article className="flex-1 rounded-2xl border border-slate-200 p-7 bg-white flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-5">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-500 mb-1">
                    02 · Local Storage CRUD Workspace
                  </p>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                    Project & Estimate Ledger
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Create, update, filter, and persist GTA drywall bids in your browser. Currently tracking{' '}
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {stats.totalProjects}
                    </span>{' '}
                    projects totaling{' '}
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      ${stats.totalEstimateCad.toLocaleString()} CAD
                    </span>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Manage Project Records
                </button>
              </article>

              <article className="flex-1 rounded-2xl border border-slate-200 p-7 bg-white flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-5">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-500 mb-1">
                    03 · Live Axios API Integration
                  </p>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                    GTA Site Curing Forecast
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Real-time temperature, humidity, and 5-day joint compound drying guidance fetched via Axios across 6 GTA municipalities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('weather')}
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-300 hover:border-[#7C3AED] hover:text-[#7C3AED] text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Check GTA Site Conditions
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
