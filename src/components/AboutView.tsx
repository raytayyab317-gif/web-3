import { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../types/constructex';

interface AboutViewProps {
  onNavigate: (route: PageRoute) => void;
}

const LIVING_ROOM_IMG = '/src/assets/images/about_living_room_1795027210247.jpg';

export default function AboutView({ onNavigate }: AboutViewProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="pt-28 pb-20 px-6 bg-white min-h-[calc(100vh-4rem)] flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold text-[#7C3AED] mb-3">
              Established 2006 · Ontario Licensed
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-7 text-balance">
              Building the GTA&apos;s Architectural Backbone.
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-5">
              Since 2006, ConstructEx has been the premier partner for luxury residential and high-end commercial developments across the Greater Toronto Area.
            </p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              We don&apos;t just hang drywall; we engineer structural steel stud foundations and deliver seamless Level-5 plaster finishes that set the benchmark for modern architectural precision.
            </p>

            <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6">
              <div>
                <p className="font-display text-3xl font-extrabold text-[#7C3AED] tabular-nums">18+</p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Years Active
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-slate-900">GTA</p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Service Region
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">Level-5</p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Finish Standard
                </p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-6 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Explore Active Projects
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-lg border border-slate-300 hover:border-slate-900 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                Request an Estimate
              </button>
            </div>
          </div>

          {/* Architectural Showcase Image */}
          <div className="relative flex flex-col">
            <div className="flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
              {!imgFailed ? (
                <img
                  src={LIVING_ROOM_IMG}
                  alt="Luxury GTA living room featuring seamless Level-5 drywall walls and cove lighting"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-2 p-8">
                  <ShieldCheck className="w-10 h-10 text-[#7C3AED]" />
                  <p className="text-sm font-medium">ConstructEx Architectural Showcase</p>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold text-slate-900">
                  Precision Guaranteed · WSIB & Ontario Insured
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Serving Toronto, Mississauga, Vaughan, Markham, Oakville, and Brampton.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
