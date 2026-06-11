import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Loader2, Rocket } from 'lucide-react';
import {
  getAdminSettings,
  getProjects,
  getSiteSettings,
  publishSite,
  saveSiteSettings,
} from '../api';
import type { AdminSettingsRow } from '../types';
import { availabilityCopy, type AvailabilityState } from '@/lib/availability';
import { Badge } from '@/admin/ui/badge';
import { Button } from '@/admin/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/admin/ui/card';
import { Label } from '@/admin/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/admin/ui/select';
import { Skeleton } from '@/admin/ui/skeleton';
import { cn } from '@/lib/utils';

const STATES: { value: AvailabilityState; label: string; hint: string }[] = [
  { value: 'available', label: 'Beschikbaar', hint: 'Open voor nieuwe projecten' },
  { value: 'limited', label: 'Beperkt', hint: 'Weinig ruimte, selectief' },
  { value: 'unavailable', label: 'Niet beschikbaar', hint: 'Volgeboekt' },
];

const MONTHS_NL = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

const NONE = 'none';

function formatTimestamp(iso: string | null): string {
  if (!iso) return 'Nog nooit gepubliceerd';
  return new Date(iso).toLocaleString('nl-NL', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AvailabilityState>('available');
  const [fromMonth, setFromMonth] = useState(NONE);
  const [fromYear, setFromYear] = useState(NONE);
  const [savingStatus, setSavingStatus] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsRow | null>(null);
  const [counts, setCounts] = useState({ published: 0, draft: 0 });

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return [current, current + 1, current + 2].map(String);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSiteSettings(), getAdminSettings(), getProjects()])
      .then(([site, admin, projects]) => {
        if (cancelled) return;
        if (site) {
          setState(site.availability_state);
          const m = site.available_from?.match(/^(\d{4})-(\d{2})$/);
          setFromYear(m ? m[1] : NONE);
          setFromMonth(m ? m[2] : NONE);
        }
        setAdminSettings(admin);
        setCounts({
          published: projects.filter((p) => p.published).length,
          draft: projects.filter((p) => !p.published).length,
        });
      })
      .catch((err: Error) =>
        toast.error('Laden mislukt', { description: err.message })
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const availableFrom =
    fromMonth !== NONE && fromYear !== NONE ? `${fromYear}-${fromMonth}` : null;

  const preview = availabilityCopy({ state, availableFrom });

  const saveStatus = async () => {
    setSavingStatus(true);
    try {
      await saveSiteSettings({
        availability_state: state,
        available_from: state === 'available' ? null : availableFrom,
      });
      toast.success('Status opgeslagen', {
        description: 'Publiceer de site om de wijziging live te zetten.',
      });
    } catch (err) {
      toast.error('Opslaan mislukt', { description: (err as Error).message });
    } finally {
      setSavingStatus(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      await publishSite();
      setAdminSettings((s) =>
        s
          ? { ...s, last_published_at: new Date().toISOString() }
          : { id: 1, deploy_hook_url: null, last_published_at: new Date().toISOString() }
      );
      toast.success('Publicatie gestart', {
        description: 'De site wordt opnieuw gebouwd en staat over ±1 minuut live.',
      });
    } catch (err) {
      toast.error('Publiceren mislukt', { description: (err as Error).message });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Beschikbaarheid</CardTitle>
          <CardDescription>
            Zichtbaar op drie plekken op de site: hero, about en contact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {STATES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setState(s.value)}
                className={cn(
                  'cursor-pointer rounded-md border px-4 py-3 text-left transition-colors',
                  state === s.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-secondary/60'
                )}
              >
                <span className="block text-sm font-medium">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.hint}</span>
              </button>
            ))}
          </div>

          {state !== 'available' && (
            <div className="flex flex-col gap-2">
              <Label>Weer beschikbaar vanaf (optioneel)</Label>
              <div className="flex gap-2">
                <Select value={fromMonth} onValueChange={setFromMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Maand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Geen maand</SelectItem>
                    {MONTHS_NL.map((m, i) => (
                      <SelectItem key={m} value={String(i + 1).padStart(2, '0')}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={fromYear} onValueChange={setFromYear}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Jaar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Geen jaar</SelectItem>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="rounded-md border border-border bg-background px-4 py-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Zo komt het op de site
            </p>
            <p className="text-sm">
              Hero: <span className="text-muted-foreground">“{preview.hero}”</span>
            </p>
            <p className="text-sm">
              Contact: <span className="text-muted-foreground">“{preview.contact}”</span>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveStatus} disabled={savingStatus}>
            {savingStatus && <Loader2 className="animate-spin" />}
            Status opslaan
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Publiceren</CardTitle>
            <CardDescription>
              Opgeslagen wijzigingen staan pas live na een publicatie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Laatste publicatie:{' '}
              <span className="text-foreground">
                {formatTimestamp(adminSettings?.last_published_at ?? null)}
              </span>
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={publish} disabled={publishing}>
              {publishing ? <Loader2 className="animate-spin" /> : <Rocket />}
              Publiceer site
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projecten</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mr-1">{counts.published} live</Badge>
              <Badge variant="outline">{counts.draft} concept</Badge>
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button variant="outline" asChild>
              <Link to="/projecten">
                Naar projecten
                <ArrowRight />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
