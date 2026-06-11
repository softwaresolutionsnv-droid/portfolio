/**
 * Site content — single source of truth for everything the CMS manages.
 *
 * `src/data/content.json` is regenerated at build time from Supabase by
 * `scripts/fetch-content.mjs` (when CMS env vars are present). Without
 * them the checked-in JSON is used as-is, so the site always builds.
 */

import type { Availability } from './availability';
import rawContent from '../data/content.json';

export type GalleryImage = {
  image: string;
  alt: string;
};

export type ProjectContent = {
  /** URL slug for the case study deep link (/work/:slug). */
  slug: string;
  title: string;
  /** Card-level summary. Used on the rail card only. */
  description: string;
  /** Editorial lead inside the case-study modal — never the card text verbatim. */
  lede: string;
  tags: string[];
  role: string;
  year: string;
  client: string;
  url?: string | null;
  image: string;
  imageAlt: string;
  color: string;
  overview: string[];
  highlights: { label: string; value: string }[];
  /** Extra case-study imagery, rendered below the highlights. */
  gallery: GalleryImage[];
  /** Show the Live / On request status badge on the card. */
  showBadge?: boolean;
  /** Show the live-site / request-access CTA inside the case study. */
  showCta?: boolean;
};

export type SiteContent = {
  availability: Availability;
  about: {
    intro: string;
    body: string;
    details: { label: string; value: string }[];
  };
  skills: {
    intro: string;
    picks: { tools: string; when: string }[];
  };
  contact: {
    email: string;
    location: string;
    socials: { label: string; href: string }[];
  };
  projects: ProjectContent[];
};

export const siteContent = rawContent as unknown as SiteContent;
