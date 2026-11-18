import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageRoute, UserSession } from '../types/constructex';

interface NavbarProps {
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  session: UserSession | null;
  onSignOut: () => void;
}

const NAV_ITEMS: { route: PageRoute; label: string }[] = [
  { route: 'home', label: 'Home' },
  { route: 'projects', label: 'Projects' },
  { route: 'weather', label: 'Site Weather' },
  { route: 'about', label: 'About' },
  { route: 'contact', label: 'Contact' },
];

export default function Navbar({
  activeRoute,
  onNavigate,
  session,
  onSignOut,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-display text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3AED] cursor-pointer"
        >
          Construct<span className="text-[#7C3AED]">Ex</span>
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3AED] ${
                  isActive
                    ? 'text-[#7C3AED] border-[#7C3AED] font-semibold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {session ? (
            <button
              type="button"
              onClick={onSignOut}
              className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
              title={`Signed in as ${session.email}`}
            >
              Sign Out ({session.fullName.split(' ')[0]})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNav(activeRoute === 'signin' ? 'signup' : 'signin')}
              className="hidden md:inline-flex items-center px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
            >
              {activeRoute === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-2 shadow-lg"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#7C3AED]/10 text-[#7C3AED] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            {session ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 text-left cursor-pointer"
              >
                Sign Out ({session.fullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleNav('signin')}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('signup')}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
