import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import { supabase } from './supabase';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './pages/ProjectList';
import { ProjectEditor } from './pages/ProjectEditor';
import { SiteSettings } from './pages/SiteSettings';
import { Toaster } from '@/admin/ui/sonner';

type Theme = 'dark' | 'light';

function NotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-lg space-y-4">
        <h1 className="font-display text-2xl">CMS is nog niet geconfigureerd</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          De omgevingsvariabelen <code>VITE_SUPABASE_URL</code> en{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> (of{' '}
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>) ontbreken. Lokaal horen ze
          in <code>.env.local</code> (herstart daarna de dev-server); op Vercel
          onder Environment Variables, gevolgd door een redeploy. Zie{' '}
          <code>docs/cms-setup.md</code>. De portfolio zelf werkt gewoon door op
          de meegeleverde content.
        </p>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = 'CMS · Nils Vogelaar';
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  if (!supabase) return <NotConfigured />;

  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <AdminLayout theme={theme} onToggleTheme={toggleTheme} />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projecten" element={<ProjectList />} />
            <Route path="projecten/nieuw" element={<ProjectEditor />} />
            <Route path="projecten/:id" element={<ProjectEditor />} />
            <Route path="instellingen" element={<SiteSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster theme={theme} position="bottom-right" />
    </AuthProvider>
  );
}
