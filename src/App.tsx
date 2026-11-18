/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ProjectsView from './components/ProjectsView';
import WeatherView from './components/WeatherView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AuthView from './components/AuthView';
import {
  PageRoute,
  ProjectFormInput,
  ProjectRecord,
  UserSession,
} from './types/constructex';
import {
  computePortfolioStats,
  createProject,
  deleteProject,
  loadProjects,
  resetToSeedProjects,
  saveProjects,
  updateProject,
} from './utils/projectStore';
import { clearSession, loadSession } from './utils/authStore';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as PageRoute | null;
      if (
        viewParam &&
        ['home', 'projects', 'weather', 'about', 'contact', 'signin', 'signup'].includes(
          viewParam
        )
      ) {
        return viewParam;
      }
    }
    return 'home';
  });

  const [projects, setProjects] = useState<ProjectRecord[]>(() => loadProjects());
  const [session, setSession] = useState<UserSession | null>(() => loadSession());

  const stats = useMemo(() => computePortfolioStats(projects), [projects]);

  const handleNavigate = (route: PageRoute) => {
    setActiveRoute(route);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreateProject = (input: ProjectFormInput): ProjectRecord => {
    const res = createProject(projects, input);
    setProjects(res.projects);
    return res.created;
  };

  const handleUpdateProject = (id: string, input: ProjectFormInput) => {
    const res = updateProject(projects, id, input);
    setProjects(res.projects);
  };

  const handleDeleteProject = (id: string) => {
    const next = deleteProject(projects, id);
    setProjects(next);
  };

  const handleRestoreDeleted = (record: ProjectRecord) => {
    const next = [record, ...projects];
    saveProjects(next);
    setProjects(next);
  };

  const handleResetSamples = () => {
    const seeded = resetToSeedProjects();
    setProjects(seeded);
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        session={session}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {activeRoute === 'home' && (
          <HomeView stats={stats} onNavigate={handleNavigate} />
        )}
        {activeRoute === 'projects' && (
          <ProjectsView
            projects={projects}
            stats={stats}
            onCreate={handleCreateProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            onRestoreDeleted={handleRestoreDeleted}
            onResetSamples={handleResetSamples}
          />
        )}
        {activeRoute === 'weather' && <WeatherView />}
        {activeRoute === 'about' && <AboutView onNavigate={handleNavigate} />}
        {activeRoute === 'contact' && (
          <ContactView
            onCreateEstimateFromInquiry={handleCreateProject}
            onNavigate={handleNavigate}
          />
        )}
        {(activeRoute === 'signin' || activeRoute === 'signup') && (
          <AuthView
            mode={activeRoute}
            onNavigate={handleNavigate}
            onAuthenticated={(userSession) => setSession(userSession)}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
