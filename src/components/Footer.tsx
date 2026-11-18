import { PageRoute } from '../types/constructex';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="font-display text-xl font-extrabold tracking-tight text-slate-900 cursor-pointer"
          >
            Construct<span className="text-[#7C3AED]">Ex</span>
          </button>
          <p className="mt-1.5 text-sm text-slate-500">
            Architectural Drywall, Steel Framing & Level-5 Finishing · Greater Toronto Area since 2006
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => onNavigate('weather')}
            className="hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            Site Weather
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => onNavigate('signin')}
            className="hover:text-[#7C3AED] transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </nav>

        <p className="text-xs text-slate-400">
          © 2026 ConstructEx Contracting Ltd. Licensed & Insured in Ontario.
        </p>
      </div>
    </footer>
  );
}
