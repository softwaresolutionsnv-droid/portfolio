import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { getAdminSettings, getSiteSettings, saveAdminSettings, saveSiteSettings } from '../api';
import type { AboutContent, ContactContent, SkillsContent } from '../types';
import { PairListEditor } from '../components/ListEditors';
import { Button } from '@/admin/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/admin/ui/card';
import { Input } from '@/admin/ui/input';
import { Label } from '@/admin/ui/label';
import { Skeleton } from '@/admin/ui/skeleton';
import { Textarea } from '@/admin/ui/textarea';

const EMPTY_ABOUT: AboutContent = { intro: '', body: '', details: [] };
const EMPTY_SKILLS: SkillsContent = { intro: '', picks: [] };
const EMPTY_CONTACT: ContactContent = { email: '', location: '', socials: [] };

export function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<AboutContent>(EMPTY_ABOUT);
  const [skills, setSkills] = useState<SkillsContent>(EMPTY_SKILLS);
  const [contact, setContact] = useState<ContactContent>(EMPTY_CONTACT);
  const [deployHookUrl, setDeployHookUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSiteSettings(), getAdminSettings()])
      .then(([site, admin]) => {
        if (cancelled) return;
        if (site) {
          setAbout({ ...EMPTY_ABOUT, ...site.about });
          setSkills({ ...EMPTY_SKILLS, ...site.skills });
          setContact({ ...EMPTY_CONTACT, ...site.contact });
        }
        setDeployHookUrl(admin?.deploy_hook_url ?? '');
      })
      .catch((err: Error) => toast.error('Laden mislukt', { description: err.message }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteSettings({ about, skills, contact });
      await saveAdminSettings({ deploy_hook_url: deployHookUrl.trim() || null });
      toast.success('Instellingen opgeslagen', {
        description: 'Publiceer de site om tekstwijzigingen live te zetten.',
      });
    } catch (err) {
      toast.error('Opslaan mislukt', { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Site & teksten</h1>
          <p className="text-sm text-muted-foreground">
            De vaste teksten van de portfolio. De site blijft Engelstalig.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Opslaan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Over mij</CardTitle>
          <CardDescription>
            De statusregel onder “Status” komt automatisch uit je beschikbaarheid op
            het dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="about-intro">Eerste alinea</Label>
            <Textarea
              id="about-intro"
              value={about.intro}
              onChange={(e) => setAbout({ ...about, intro: e.target.value })}
              className="min-h-28"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="about-body">Tweede alinea</Label>
            <Textarea
              id="about-body"
              value={about.body}
              onChange={(e) => setAbout({ ...about, body: e.target.value })}
              className="min-h-28"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Detailregels (rechterkolom)</Label>
            <PairListEditor
              items={about.details}
              onChange={(items) =>
                setAbout({ ...about, details: items as AboutContent['details'] })
              }
              fields={[
                { key: 'label', placeholder: 'Label (bijv. Based in)', className: 'w-40' },
                { key: 'value', placeholder: 'Waarde (bijv. Amsterdam, NL)' },
              ]}
              addLabel="Regel toevoegen"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>“How I pick the stack” — intro en keuzes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="skills-intro">Introtekst</Label>
            <Textarea
              id="skills-intro"
              value={skills.intro}
              onChange={(e) => setSkills({ ...skills, intro: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Stack-keuzes</Label>
            <PairListEditor
              items={skills.picks}
              onChange={(items) =>
                setSkills({ ...skills, picks: items as SkillsContent['picks'] })
              }
              fields={[
                { key: 'tools', placeholder: 'Tools (bijv. Vue, Nuxt)', className: 'w-44' },
                { key: 'when', placeholder: 'Wanneer je hiernaar grijpt', multiline: true },
              ]}
              addLabel="Keuze toevoegen"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">E-mailadres</Label>
              <Input
                id="contact-email"
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-location">Locatie</Label>
              <Input
                id="contact-location"
                value={contact.location}
                onChange={(e) => setContact({ ...contact, location: e.target.value })}
                placeholder="Amsterdam"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Social links</Label>
            <PairListEditor
              items={contact.socials}
              onChange={(items) =>
                setContact({ ...contact, socials: items as ContactContent['socials'] })
              }
              fields={[
                { key: 'label', placeholder: 'Label (bijv. LinkedIn)', className: 'w-40' },
                { key: 'href', placeholder: 'https://…' },
              ]}
              addLabel="Link toevoegen"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publicatie</CardTitle>
          <CardDescription>
            De Vercel deploy hook die de “Publiceer site”-knop aanroept. Aanmaken kan
            in Vercel onder Project → Settings → Git → Deploy Hooks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="deploy-hook">Deploy hook URL</Label>
            <Input
              id="deploy-hook"
              type="url"
              value={deployHookUrl}
              onChange={(e) => setDeployHookUrl(e.target.value)}
              placeholder="https://api.vercel.com/v1/integrations/deploy/…"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Opslaan
        </Button>
      </div>
    </div>
  );
}
