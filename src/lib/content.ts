/**
 * Site content — `src/data/content.json` is de bron (ADR-0002); dit type
 * is het schema. Tekstvelden zijn {nl,en}-paren met Nederlands als
 * brontaal (ADR-0003). Vocabulaire: CONTEXT.md.
 */

import type { Availability } from './availability';
import type { Localized, LocalizedLines } from './i18n';
import rawContent from '../data/content.json';

/** Wie het werkstuk liet maken — altijd zichtbaar, nooit weggelaten (ADR-0001). */
export type Herkomst = 'in-opdracht' | 'eigen-product';

/** Bepaalt of er een link staat en welk label de bezoeker ziet. */
export type Status = 'live' | 'pre-launch' | 'besloten';

/** Vaste volgorde: automatisering → maatwerk → sites-merk (ADR-0006). De volgorde draagt de positionering. */
export type Groep = 'automatisering' | 'maatwerk' | 'sites-merk';

export const GROEP_VOLGORDE: Groep[] = ['automatisering', 'maatwerk', 'sites-merk'];

export type Scherm = 'desktop' | 'mobiel';

/** Viewportbreedte per scherm — gelijk aan SCHERMEN in scripts/capture-artefacts.mjs. */
export const SCHERM_BREEDTE: Record<Scherm, number> = { desktop: 1440, mobiel: 390 };

export type GalleryImage = {
  image: string;
  alt: Localized;
  /** Gezet bij uitsneden. Ontbreekt het, dan geldt de oude naamregel (`-m-NN.png`). */
  scherm?: Scherm;
};

export const isPortrait = (g: GalleryImage) => (g.scherm ? g.scherm === 'mobiel' : /-m-\d+\.png$/.test(g.image));

/** De vaste aanwijzing welk deel van welke pagina, op welk scherm, een artefact
    toont (CONTEXT.md). Bij een live werkstuk wekelijks opnieuw opgenomen door
    scripts/capture-artefacts.mjs (ADR-0005). */
export type Uitsnede = {
  /** Waar de opname staat, bijv. `/projects/puikbouw-hero.jpg`. */
  beeld: string;
  /** Pagina op de site van het werkstuk, relatief aan `url`. */
  pad: string;
  /** Moet precies één element vinden — anders faalt de opname. */
  selector: string;
  scherm: Scherm;
  /** Tekst die in de uitsnede hoort te staan. Verandert die, dan het bijschrift controleren. */
  anker: string;
  bijschrift: Localized;
};

/** Diagram — beeld van software die niet te fotograferen is (CONTEXT.md):
    een getypografeerde pijplijn, stap voor stap, in leesvolgorde. */
export type Diagram = {
  kop: Localized;
  bijschrift: Localized;
  stappen: { label: Localized; titel: Localized; noot: Localized }[];
};

export type Werkstuk = {
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
  /** Afgeleid uit de eerste uitsnede. */
  imageScherm?: Scherm;
  highlights: { label: Localized; value: Localized }[];
  gallery: GalleryImage[];
  /** Gezet = het werkstuk wordt getoond als diagram in plaats van artefacten. */
  diagram?: Diagram;
  /** Gezet = de beelden komen hieruit; `image`, `imageAlt` en `gallery` worden afgeleid. */
  uitsneden?: Uitsnede[];
};

/** Zoals in content.json: wie uitsneden heeft, laat de afgeleide beeldvelden weg. */
type RuwWerkstuk = Omit<Werkstuk, 'image' | 'imageAlt' | 'gallery'> &
  Partial<Pick<Werkstuk, 'image' | 'imageAlt' | 'gallery'>>;

export type SiteContent = {
  availability: Availability;
  hero: {
    headline: LocalizedLines;
    practice: Localized;
  };
  /** Probleem in de taal van de opdrachtgever + aanpak + het werkstuk dat het bewijst (CONTEXT.md: oplossing).
      `bewijs` ontbreekt waar nog geen werkstuk het aantoont — dan geen tegel, nooit een geleend bewijs.
      `systemen` vult die plek met gangbare toolnamen als voorbeeld; geen claim dat die al gekoppeld zijn. */
  oplossingen: {
    intro: Localized;
    items: {
      probleem: Localized;
      aanpak: Localized;
      bewijs?: { slug: string; feit: Localized };
      systemen?: string[];
    }[];
  };
  work: { intro: Localized };
  werkwijze: {
    items: { label: Localized; kop: Localized; tekst: Localized }[];
  };
  about: {
    intro: Localized;
    body: Localized;
    details: { label: Localized; value: Localized }[];
  };
  contact: {
    email: string;
    location: string;
    pitch: Localized;
    /** Agenda-link voor een kennismaking; zolang die ontbreekt valt de knop terug op mail. */
    bookingUrl: string | null;
    socials: { label: string; href: string }[];
  };
  werkstukken: Werkstuk[];
};

function metBeelden(w: RuwWerkstuk): Werkstuk {
  if (!w.uitsneden?.length) return w as Werkstuk;
  const [eerste, ...rest] = w.uitsneden;
  return {
    ...w,
    image: eerste.beeld,
    imageAlt: eerste.bijschrift,
    imageScherm: eerste.scherm,
    gallery: rest.map((u) => ({ image: u.beeld, alt: u.bijschrift, scherm: u.scherm })),
  };
}

const raw = rawContent as unknown as Omit<SiteContent, 'werkstukken'> & { werkstukken: RuwWerkstuk[] };

export const siteContent: SiteContent = { ...raw, werkstukken: raw.werkstukken.map(metBeelden) };

/** Kennismaking — de agenda-link zodra die er is, anders mail met onderwerp. */
export function kennismakingLink(subject: string) {
  const { bookingUrl, email } = siteContent.contact;
  return bookingUrl
    ? { href: bookingUrl, target: '_blank', rel: 'noopener noreferrer' }
    : { href: `mailto:${email}?subject=${encodeURIComponent(subject)}` };
}

/** Een gewone linkerklik opent het werkstuk ter plekke; met een modifier (nieuw tabblad, venster) doet de browser zijn eigen werk. */
export const opensInPlace = (e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/** Open een werkstuk vanaf elders op de pagina: dezelfde route als een gedeelde /work/:slug-link. */
export function openWerkstuk(slug: string) {
  window.history.pushState({ cs: slug }, '', `/work/${slug}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
