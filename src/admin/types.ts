import type { AvailabilityState } from '@/lib/availability';

export type Highlight = { label: string; value: string };
export type GalleryItem = { image: string; alt: string };

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  lede: string;
  tags: string[];
  role: string;
  year: string;
  client: string;
  url: string | null;
  /** Storage object key, or a site-absolute path for legacy repo assets. */
  image: string | null;
  image_alt: string;
  color: string;
  overview: string[];
  highlights: Highlight[];
  gallery: GalleryItem[];
  show_badge: boolean;
  show_cta: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Editable fields of a project (everything except server-managed columns). */
export type ProjectDraft = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>;

export type AboutContent = {
  intro: string;
  body: string;
  details: { label: string; value: string }[];
};

export type SkillsContent = {
  intro: string;
  picks: { tools: string; when: string }[];
};

export type ContactContent = {
  email: string;
  location: string;
  socials: { label: string; href: string }[];
};

export type SiteSettingsRow = {
  id: number;
  availability_state: AvailabilityState;
  available_from: string | null;
  about: AboutContent;
  skills: SkillsContent;
  contact: ContactContent;
  updated_at: string;
};

export type AdminSettingsRow = {
  id: number;
  deploy_hook_url: string | null;
  last_published_at: string | null;
};

export function emptyProjectDraft(sortOrder: number): ProjectDraft {
  return {
    slug: '',
    title: '',
    description: '',
    lede: '',
    tags: [],
    role: '',
    year: String(new Date().getFullYear()),
    client: '',
    url: null,
    image: null,
    image_alt: '',
    color: 'oklch(0.22 0.05 230)',
    overview: [],
    highlights: [],
    gallery: [],
    show_badge: false,
    show_cta: false,
    published: false,
    sort_order: sortOrder,
  };
}
