import { FormEvent, useState } from 'react';
import { PageRoute, UserSession } from '../types/constructex';
import { authenticateUser, registerUser } from '../utils/authStore';

interface AuthViewProps {
  mode: 'signin' | 'signup';
  onNavigate: (route: PageRoute) => void;
  onAuthenticated: (session: UserSession) => void;
}

export default function AuthView({
  mode,
  onNavigate,
  onAuthenticated,
}: AuthViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = isSignUp
      ? registerUser(fullName, email, password)
      : authenticateUser(email, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onAuthenticated(result.session);
    onNavigate('projects');
  };

  return (
    <section className="pt-28 pb-20 px-6 bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {isSignUp
              ? 'Join ConstructEx to manage your GTA drywall projects'
              : 'Sign in to your ConstructEx workspace'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
            >
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label
                htmlFor="auth-fullname"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="auth-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jordan Patel"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@constructex.ca"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-colors cursor-pointer ${
              isSignUp
                ? 'bg-[#7C3AED] hover:bg-[#6D28D9]'
                : 'bg-slate-900 hover:bg-black'
            }`}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-500 pt-2">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    onNavigate('signin');
                  }}
                  className="text-slate-900 font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    onNavigate('signup');
                  }}
                  className="text-[#7C3AED] font-semibold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
