import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Loader2,
  MoreVertical,
  Save,
  Trash2,
} from 'lucide-react';
import { createProject, deleteProject, getProject, updateProject } from '../api';
import { emptyProjectDraft, type Highlight, type ProjectDraft } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import { GalleryEditor } from '../components/GalleryEditor';
import { TagInput } from '../components/TagInput';
import { PairListEditor, StringListEditor } from '../components/ListEditors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/admin/ui/alert-dialog';
import { Button } from '@/admin/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/admin/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/admin/ui/dropdown-menu';
import { Input } from '@/admin/ui/input';
import { Label } from '@/admin/ui/label';
import { Skeleton } from '@/admin/ui/skeleton';
import { Switch } from '@/admin/ui/switch';
import { Textarea } from '@/admin/ui/textarea';
import { cn } from '@/lib/utils';

const COLOR_SWATCHES = [
  { value: 'oklch(0.22 0.05 230)', label: 'Diep blauw' },
  { value: 'oklch(0.20 0.04 220)', label: 'Staalblauw' },
  { value: 'oklch(0.18 0.03 240)', label: 'Indigo' },
  { value: 'oklch(0.20 0.05 150)', label: 'Bosgroen' },
  { value: 'oklch(0.22 0.06 25)', label: 'Donker ember' },
  { value: 'oklch(0.20 0.05 310)', label: 'Aubergine' },
  { value: 'oklch(0.18 0.01 50)', label: 'Grafiet' },
];

function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  // New projects land at the end of the rail; dragging in the list
  // normalizes sort_order afterwards.
  const [draft, setDraft] = useState<ProjectDraft>(() => emptyProjectDraft(9999));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Once the slug is hand-edited it stops following the title.
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getProject(id)
      .then((row) => {
        if (cancelled) return;
        if (!row) {
          toast.error('Project niet gevonden');
          navigate('/projecten', { replace: true });
          return;
        }
        slugTouched.current = true;
        setDraft({
          slug: row.slug,
          title: row.title,
          description: row.description,
          lede: row.lede,
          tags: row.tags,
          role: row.role,
          year: row.year,
          client: row.client,
          url: row.url,
          image: row.image,
          image_alt: row.image_alt,
          color: row.color,
          overview: row.overview,
          highlights: row.highlights,
          gallery: row.gallery,
          show_badge: row.show_badge,
          show_cta: row.show_cta,
          published: row.published,
          sort_order: row.sort_order,
        });
      })
      .catch((err: Error) => toast.error('Laden mislukt', { description: err.message }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const patch = (p: Partial<ProjectDraft>) => setDraft((d) => ({ ...d, ...p }));

  const onTitleChange = (title: string) => {
    patch(slugTouched.current ? { title } : { title, slug: slugify(title) });
  };

  const save = async () => {
    if (!draft.title.trim()) {
      toast.error('Titel is verplicht');
      return;
    }
    const slug = draft.slug.trim() || slugify(draft.title);
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error('Ongeldige slug', {
        description: 'Gebruik alleen kleine letters, cijfers en streepjes.',
      });
      return;
    }
    const payload: ProjectDraft = {
      ...draft,
      slug,
      title: draft.title.trim(),
      url: draft.url?.trim() ? draft.url.trim() : null,
    };
    setSaving(true);
    try {
      if (id) {
        await updateProject(id, payload);
      } else {
        const row = await createProject(payload);
        navigate(`/projecten/${row.id}`, { replace: true });
      }
      setDraft(payload);
      toast.success('Project opgeslagen', {
        description: 'Publiceer de site om de wijziging live te zetten.',
      });
    } catch (err) {
      const message = (err as Error).message;
      toast.error('Opslaan mislukt', {
        description: message.includes('duplicate')
          ? `De slug “${slug}” bestaat al — kies een andere.`
          : message,
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!id) return;
    try {
      await deleteProject(id);
      toast.success('Project verwijderd');
      navigate('/projecten', { replace: true });
    } catch (err) {
      toast.error('Verwijderen mislukt', { description: (err as Error).message });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Terug naar projecten">
            <Link to="/projecten">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="truncate font-display text-2xl">
            {isNew ? 'Nieuw project' : draft.title || 'Project bewerken'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Switch
              checked={draft.published}
              onCheckedChange={(published) => patch({ published })}
            />
            {draft.published ? 'Live' : 'Concept'}
          </label>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            Opslaan
          </Button>
          {!isNew && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Meer acties">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {draft.published && draft.slug && (
                  <DropdownMenuItem asChild>
                    <a href={`/work/${draft.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink />
                      Bekijk op site
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
                  <Trash2 />
                  Verwijderen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Basis */}
      <Card>
        <CardHeader>
          <CardTitle>Basis</CardTitle>
          <CardDescription>Wat op de projectkaart in de rail staat.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Projectnaam"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="client">Opdrachtgever</Label>
              <Input
                id="client"
                value={draft.client}
                onChange={(e) => patch({ client: e.target.value })}
                placeholder="Bijv. Autodisk"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">/work/</span>
                <Input
                  id="slug"
                  value={draft.slug}
                  onChange={(e) => {
                    slugTouched.current = true;
                    patch({ slug: e.target.value });
                  }}
                  placeholder="project-naam"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="year">Jaar</Label>
                <Input
                  id="year"
                  value={draft.year}
                  onChange={(e) => patch({ year: e.target.value })}
                  placeholder="2026"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Rol</Label>
                <Input
                  id="role"
                  value={draft.role}
                  onChange={(e) => patch({ role: e.target.value })}
                  placeholder="Frontend Developer"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="url">Live URL (optioneel)</Label>
              <Input
                id="url"
                type="url"
                value={draft.url ?? ''}
                onChange={(e) => patch({ url: e.target.value })}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Korte omschrijving</Label>
            <Textarea
              id="description"
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="2–3 zinnen op de projectkaart."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lede">Lede</Label>
            <Textarea
              id="lede"
              value={draft.lede}
              onChange={(e) => patch({ lede: e.target.value })}
              placeholder="Eén krachtige openingszin in de case study — nooit de kaarttekst herhalen."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <TagInput
              value={draft.tags}
              onChange={(tags) => patch({ tags })}
              placeholder="Bijv. TypeScript — Enter om toe te voegen"
            />
          </div>
        </CardContent>
      </Card>

      {/* Beelden */}
      <Card>
        <CardHeader>
          <CardTitle>Beelden</CardTitle>
          <CardDescription>
            Upload JPG of PNG; de site genereert zelf WebP-varianten bij publicatie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label>Hoofdbeeld</Label>
            <ImageUpload
              value={draft.image}
              slugHint={draft.slug || slugify(draft.title)}
              onChange={(image) => patch({ image })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image-alt">Alt-tekst hoofdbeeld</Label>
            <Input
              id="image-alt"
              value={draft.image_alt}
              onChange={(e) => patch({ image_alt: e.target.value })}
              placeholder="Beschrijf wat er op het beeld te zien is"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Galerij (in de case study)</Label>
            <GalleryEditor
              items={draft.gallery}
              slugHint={draft.slug || slugify(draft.title)}
              onChange={(gallery) => patch({ gallery })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Case study */}
      <Card>
        <CardHeader>
          <CardTitle>Case study</CardTitle>
          <CardDescription>De inhoud van de uitklappagina.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label>Overview-alinea’s</Label>
            <StringListEditor
              items={draft.overview}
              onChange={(overview) => patch({ overview })}
              addLabel="Alinea toevoegen"
              placeholder="Eén alinea van de case study."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Highlights</Label>
            <PairListEditor
              items={draft.highlights}
              onChange={(items) => patch({ highlights: items as Highlight[] })}
              fields={[
                { key: 'label', placeholder: 'Label (bijv. Platform)', className: 'w-40' },
                { key: 'value', placeholder: 'Waarde (bijv. iOS · Android · Web)' },
              ]}
              addLabel="Highlight toevoegen"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Accentkleur (achter het beeld)</Label>
            <div className="flex flex-wrap gap-2">
              {[
                ...COLOR_SWATCHES,
                ...(COLOR_SWATCHES.some((s) => s.value === draft.color)
                  ? []
                  : [{ value: draft.color, label: 'Huidig' }]),
              ].map((swatch) => (
                <button
                  key={swatch.value}
                  type="button"
                  title={swatch.label}
                  onClick={() => patch({ color: swatch.value })}
                  className={cn(
                    'grid size-9 cursor-pointer place-items-center rounded-md border transition-transform hover:scale-105',
                    draft.color === swatch.value ? 'border-primary' : 'border-border'
                  )}
                  style={{ backgroundColor: swatch.value }}
                  aria-label={`Kleur ${swatch.label}`}
                >
                  {draft.color === swatch.value && <Check className="size-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Switch
                checked={draft.show_badge}
                onCheckedChange={(show_badge) => patch({ show_badge })}
              />
              Status-badge op de kaart (Live / On request)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Switch
                checked={draft.show_cta}
                onCheckedChange={(show_cta) => patch({ show_cta })}
              />
              CTA in de case study
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Sticky save for long forms */}
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Opslaan
        </Button>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Project verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              “{draft.title || 'Dit project'}” wordt definitief verwijderd. Geüploade
              beelden blijven in de opslag staan. Dit kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={() => void remove()}>Verwijderen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
