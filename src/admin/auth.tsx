import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabase';
import { AuthContext, useAuth, type AuthState } from './auth-context';
import { Skeleton } from '@/admin/ui/skeleton';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Without a configured client there is nothing to wait for.
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: supabase !== null,
  });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setState({ session: data.session, loading: false });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, loading: false });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-3 p-8">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
