/**
 * i18n — NL is de bron, EN de vertaling (ADR-0003). Twee lagen:
 *  - chrome-copy (labels, knoppen, aria) leeft hier in het `ui`-woordenboek;
 *  - content (werkstukken, essay, colofon) leeft als {nl,en}-paren in
 *    content.json en wordt gelezen via useLoc().
 * Componenten bevatten geen copy.
 */
import { createContext, useContext } from 'react';

export type Lang = 'nl' | 'en';
export type Localized = { nl: string; en: string };

export const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({
  lang: 'nl',
  toggleLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

/** Kies de juiste taalvariant uit een {nl,en}-paar. */
export function useLoc() {
  const { lang } = useLang();
  return (l: Localized) => l[lang];
}

const nl = {
  baseTitle: 'Nils Vogelaar — Developer & Designer',
  skip: 'Naar de inhoud',
  nav: {
    essay: 'Essay',
    colophon: 'Colofon',
    plateIndex: 'Platenindex',
    plate: 'Plaat',
    day: 'Dag',
    night: 'Nacht',
    toDay: 'Schakel naar het dagthema',
    toNight: 'Schakel naar het nachtthema',
    langButton: 'EN',
    toOtherLang: 'Switch to English',
  },
  hero: {
    titlePage: 'Titelpagina',
    role: 'Designer — Developer',
    index: 'Index van gebouwd werk',
  },
  plates: {
    header: 'De platen — gebouwd werk',
    counterSuffix: 'werkstukken · meer onder NDA',
    open: 'Open de plaat',
    openAria: 'Open werkstuk:',
    specClient: 'Opdrachtgever',
    specYear: 'Jaar',
    specRole: 'Rol',
    specStack: 'Stack',
    specHerkomst: 'Herkomst',
    specStatus: 'Status',
  },
  groep: {
    'apps-ai': 'Apps & AI-systemen',
    'mcp-tooling': 'MCP & tooling',
    'sites-merk': 'Sites & merk',
  },
  herkomst: {
    'in-opdracht': 'In opdracht',
    'eigen-product': 'Eigen product',
  },
  status: {
    live: 'Live',
    'pre-launch': 'Pre-launch',
    besloten: 'Besloten',
  },
  caseStudy: {
    ariaSuffix: 'werkstuk',
    close: 'Sluit het werkstuk',
    visit: 'Bezoek de site',
    requestAccess: 'Vraag toegang',
    overview: 'Overzicht',
    highlights: 'Specificaties',
    gallery: 'Galerij',
    backToIndex: 'Terug naar de index',
    leaf: 'Blader met ← →',
    next: 'Volgende',
    prevPlate: 'Vorige plaat',
    nextPlate: 'Volgende plaat',
  },
  trace: {
    header: 'De trace',
    disclaimer: 'Een opgenomen tool-call — een opname, geen live server.',
    vraag: 'Vraag',
    aanroep: 'Aanroep',
    antwoord: 'Antwoord',
  },
  diagram: {
    assistant: 'AI-assistent',
    assistantNote: 'Claude, of elke MCP-client',
    server: 'garmin-mcp',
    serverNote: '43 tools · Python · Fly.io',
    serverAuth: 'OAuth 2.1 + PKCE · tokens op een persistent volume',
    garmin: 'Garmin Connect-API',
    garminNote: 'slaap · HRV · training · races',
    hevy: 'Hevy-API',
    hevyNote: 'krachttraining',
    protocol: 'MCP — stdio / HTTP / SSE',
  },
  about: {
    header: 'Essay — de praktijk',
    statusLabel: 'Status',
  },
  skills: {
    header: 'Specificaties — de stack',
  },
  contact: {
    header: 'Colofon',
    eyebrow: 'Eén mail is genoeg',
    monument: ['Laten we', 'samenwerken.'],
    replies: 'Reactie binnen één werkdag',
    copyright: 'Nils Vogelaar',
    setIn: 'Gezet uit Archivo & Source Serif 4',
    backToTop: 'Naar boven',
  },
  availability: {
    available: {
      hero: 'Beschikbaar',
      about: 'Beschikbaar voor opdrachten',
      contact: 'Beschikbaar voor nieuwe opdrachten',
      cta: 'Mail me',
    },
    limited: {
      hero: 'Beperkt beschikbaar',
      about: 'Beperkt beschikbaar',
      contact: 'Beperkt beschikbaar voor nieuwe opdrachten',
      cta: 'Mail me',
    },
    unavailable: {
      hero: 'Volgeboekt',
      about: 'Volgeboekt',
      contact: 'Geen ruimte voor nieuwe opdrachten',
      cta: 'Mail me toch',
    },
    backIn: 'weer ruimte in',
  },
};

const en: typeof nl = {
  baseTitle: 'Nils Vogelaar — Developer & Designer',
  skip: 'Skip to content',
  nav: {
    essay: 'Essay',
    colophon: 'Colophon',
    plateIndex: 'Plate index',
    plate: 'Plate',
    day: 'Day',
    night: 'Night',
    toDay: 'Switch to the day theme',
    toNight: 'Switch to the night theme',
    langButton: 'NL',
    toOtherLang: 'Schakel naar Nederlands',
  },
  hero: {
    titlePage: 'Title page',
    role: 'Designer — Developer',
    index: 'Index of built work',
  },
  plates: {
    header: 'The plates — built work',
    counterSuffix: 'works · more under NDA',
    open: 'Open the plate',
    openAria: 'Open work:',
    specClient: 'Client',
    specYear: 'Year',
    specRole: 'Role',
    specStack: 'Stack',
    specHerkomst: 'Origin',
    specStatus: 'Status',
  },
  groep: {
    'apps-ai': 'Apps & AI systems',
    'mcp-tooling': 'MCP & tooling',
    'sites-merk': 'Sites & brand',
  },
  herkomst: {
    'in-opdracht': 'Commissioned',
    'eigen-product': 'Own product',
  },
  status: {
    live: 'Live',
    'pre-launch': 'Pre-launch',
    besloten: 'Confidential',
  },
  caseStudy: {
    ariaSuffix: 'case study',
    close: 'Close case study',
    visit: 'Visit live site',
    requestAccess: 'Request access',
    overview: 'Overview',
    highlights: 'Specifications',
    gallery: 'Gallery',
    backToIndex: 'Back to the index',
    leaf: 'Leaf with ← →',
    next: 'Next',
    prevPlate: 'Previous plate',
    nextPlate: 'Next plate',
  },
  trace: {
    header: 'The trace',
    disclaimer: 'A recorded tool call — a recording, not a live server.',
    vraag: 'Question',
    aanroep: 'Call',
    antwoord: 'Response',
  },
  diagram: {
    assistant: 'AI assistant',
    assistantNote: 'Claude, or any MCP client',
    server: 'garmin-mcp',
    serverNote: '43 tools · Python · Fly.io',
    serverAuth: 'OAuth 2.1 + PKCE · tokens on a persistent volume',
    garmin: 'Garmin Connect API',
    garminNote: 'sleep · HRV · training · races',
    hevy: 'Hevy API',
    hevyNote: 'strength training',
    protocol: 'MCP — stdio / HTTP / SSE',
  },
  about: {
    header: 'Essay — the practice',
    statusLabel: 'Status',
  },
  skills: {
    header: 'Specifications — the stack',
  },
  contact: {
    header: 'Colophon',
    eyebrow: 'One email is enough',
    monument: ["Let's work", 'together.'],
    replies: 'Replies within one business day',
    copyright: 'Nils Vogelaar',
    setIn: 'Set in Archivo & Source Serif 4',
    backToTop: 'Back to top',
  },
  availability: {
    available: {
      hero: 'Available',
      about: 'Available for projects',
      contact: 'Available for new projects',
      cta: 'Email me',
    },
    limited: {
      hero: 'Limited availability',
      about: 'Limited availability',
      contact: 'Limited availability for new projects',
      cta: 'Email me',
    },
    unavailable: {
      hero: 'Fully booked',
      about: 'Fully booked',
      contact: 'Not taking new projects',
      cta: 'Email me anyway',
    },
    backIn: 'back in',
  },
};

export const ui = { nl, en };

export function useT() {
  return ui[useLang().lang];
}
