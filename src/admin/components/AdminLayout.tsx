import { NavLink, Outlet } from 'react-router-dom';
import {
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings2,
  Sun,
} from 'lucide-react';
import { supabase } from '../supabase';
import { Button } from '@/admin/ui/button';
import { Separator } from '@/admin/ui/separator';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projecten', label: 'Projecten', icon: FolderKanban, end: false },
  { to: '/instellingen', label: 'Site & teksten', icon: Settings2, end: false },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout({
  theme,
  onToggleTheme,
}: {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  const signOut = () => {
    void supabase?.auth.signOut();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <div className="mb-8 px-3">
          <p className="font-display text-lg leading-tight">Nils Vogelaar</p>
          <p className="text-xs tracking-wide text-muted-foreground">CMS</p>
        </div>

        <NavItems />

        <div className="flex-1" />

        <div className="flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            Bekijk site
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === 'dark' ? 'Licht thema' : 'Donker thema'}
          </button>
          <Separator className="my-2" />
          <button
            type="button"
            onClick={signOut}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut className="size-4" />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
          <p className="font-display text-base">NV · CMS</p>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium',
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Thema wisselen">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Uitloggen">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
