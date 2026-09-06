/**
 * Site content — `src/data/content.json` is de bron (ADR-0002); dit type
 * is het schema. Tekstvelden zijn {nl,en}-paren met Nederlands als
 * brontaal (ADR-0003). Vocabulaire: CONTEXT.md.
 */

import type { Availability } from './availability';
import type { Localized } from './i18n';
import rawContent from '../data/content.json';

/** Wie het werkstuk liet maken — altijd zichtbaar, nooit weggelaten (ADR-0001). */
export type Herkomst = 'in-opdracht' | 'eigen-product';

/** Bepaalt of er een link staat en welk label de bezoeker ziet. */
export type Status = 'live' | 'pre-launch' | 'besloten';

/** Vaste volgorde: apps-ai → mcp-tooling → sites-merk. De volgorde draagt de positionering. */
export type Groep = 'apps-ai' | 'mcp-tooling' | 'sites-merk';

export const GROEP_VOLGORDE: Groep[] = ['apps-ai', 'mcp-tooling', 'sites-merk'];

export type GalleryImage = {
  image: string;
  alt: Localized;
};

/** Een opgenomen tool-call: vraag, aanroep, JSON-antwoord. Een reconstructie —
    wordt op de pagina ook zo benoemd, nooit als live server. */
export type Trace = {
  vraag: Localized;
  aanroep: string;
  antwoord: string;
  /** Optioneel bijschrift dat het antwoord leesbaar maakt (bv. seconden → tijden). */
  duiding?: Localized;
};

export type Werkstuk = {
  /** URL slug for the case page deep link (/work/:slug). */
  slug: string;
  title: string;
  groep: Groep;
  herkomst: Herkomst;
  status: Status;
  /** Bovenlaag — probleem en uitkomst, nooit techniek. Op de overzichtspagina. */
  bovenlaag: Localized;
  /** Editorial lead inside the case page — never the bovenlaag verbatim. */
  lede: Localized;
  /** Onderlaag — de technische tekst op de case-pagina, per alinea. */
  onderlaag: Localized[];
  tags: string[];
  role: Localized;
  year: string;
  /** Leeg bij eigen product — herkomst dekt het dan al. */
  client: string;
  url?: string | null;
  image: string;
  imageAlt: Localized;
  highlights: { label: Localized; value: Localized }[];
  /** Extra case-page imagery, rendered below the highlights. */
  gallery: GalleryImage[];
  trace?: Trace;
};

export type SiteContent = {
  availability: Availability;
  hero: {
    /** De praktijkregel onder het monument. */
    practice: Localized;
  };
  about: {
    intro: Localized;
    body: Localized;
    details: { label: Localized; value: Localized }[];
  };
  skills: {
    intro: Localized;
    picks: { tools: string; when: Localized }[];
  };
  contact: {
    email: string;
    location: string;
    pitch: Localized;
    socials: { label: string; href: string }[];
  };
  werkstukken: Werkstuk[];
};

export const siteContent = rawContent as unknown as SiteContent;
