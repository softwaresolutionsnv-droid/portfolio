/**
 * i18n — NL is de bron, EN de vertaling (ADR-0003). Twee lagen:
 *  - chrome-copy (labels, knoppen, aria) leeft hier in het `ui`-woordenboek;
 *  - content (werkstukken, diensten, teksten) leeft als {nl,en}-paren in
 *    content.json en wordt gelezen via useLoc().
 * Componenten bevatten geen copy.
 */
import { createContext, useContext } from 'react';

export type Lang = 'nl' | 'en';
export type Localized = { nl: string; en: string };
export type LocalizedLines = { nl: string[]; en: string[] };

export const LangContext = createContext<{ lang: Lang; toggleLang: () => void; setLang: (l: Lang) => void }>({
  lang: 'nl',
  toggleLang: () => {},
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

/** Kies de juiste taalvariant uit een {nl,en}-paar. */
export function useLoc() {
  const { lang } = useLang();
  return <T,>(l: { nl: T; en: T }) => l[lang];
}

const nl = {
  baseTitle: 'Nils Vogelaar — Developer & Designer',
  skip: 'Naar de inhoud',
  nav: {
    taglines: {
      hero: 'Goeie binnenkomst',
      work: 'Werk dat draait',
      services: 'Wat ik doe',
      about: 'Dit ben ik',
      contact: 'Laten we praten',
    },
    menu: 'Menu',
    close: 'Sluiten',
    work: 'Werk',
    services: 'Wat ik doe',
    about: 'Over mij',
    contact: 'Contact',
    getInTouch: 'Neem contact op',
    thisIsMe: 'Dit ben ik',
    planCall: 'Plan een gesprek',
    startProject: 'Start een project',
    subjectCall: 'Kennismaken',
    subjectProject: 'Nieuw project',
    toOtherLang: 'Switch to English',
    home: 'Naar boven',
  },
  hero: {
    eyebrow: 'Nils Vogelaar',
    role: 'Designer-developer',
    city: 'Amsterdam',
    follow: 'Volg mij',
  },
  work: {
    label: 'Uitgelicht werk',
    view: 'Bekijk',
    cursor: 'Bekijk case',
    openAria: 'Open werkstuk:',
    imageComing: 'Beeld volgt',
  },
  services: {
    title: 'Wat ik doe.',
    tldr: 'TLDR; ik doe veel. Mail me gewoon:',
  },
  about: {
    based: 'Gevestigd in het hart van Amsterdam',
    statusLabel: 'Status',
    linkedin: 'LinkedIn',
  },
  contact: {
    title: ['Brief me', 'iets.'],
    label: 'Neem contact op',
    mail: 'Mail me',
    linkedin: 'LinkedIn',
    copyright: 'Nils Vogelaar',
    setIn: 'Gezet uit Geist & Sometype Mono',
  },
  plates: {
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
    back: 'Terug naar werk',
    close: 'Sluit het werkstuk',
    visit: 'Bezoek de site',
    requestAccess: 'Vraag toegang',
    overview: 'Overzicht',
    credits: 'Credits',
    highlights: 'Specificaties',
    gallery: 'Galerij',
    leaf: 'Blader met ← →',
    next: 'Volgende',
    prevPlate: 'Vorig werkstuk',
    nextPlate: 'Volgend werkstuk',
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
    taglines: {
      hero: 'Nice entrance',
      work: 'Work that ships',
      services: 'What I do',
      about: 'This is me',
      contact: "Let's talk",
    },
    menu: 'Menu',
    close: 'Close',
    work: 'Work',
    services: 'What I do',
    about: 'About',
    contact: 'Contact',
    getInTouch: 'Get in touch',
    thisIsMe: 'This is me',
    planCall: 'Book a call',
    startProject: 'Start a project',
    subjectCall: 'Intro call',
    subjectProject: 'New project',
    toOtherLang: 'Schakel naar Nederlands',
    home: 'Back to top',
  },
  hero: {
    eyebrow: 'Nils Vogelaar',
    role: 'Designer-developer',
    city: 'Amsterdam',
    follow: 'Follow me',
  },
  work: {
    label: 'Featured work',
    view: 'View',
    cursor: 'View case',
    openAria: 'Open work:',
    imageComing: 'Imagery coming',
  },
  services: {
    title: 'What I do.',
    tldr: 'TLDR; I do a lot. Just email me:',
  },
  about: {
    based: 'Based in the beating heart of Amsterdam',
    statusLabel: 'Status',
    linkedin: 'LinkedIn',
  },
  contact: {
    title: ['Brief me', 'something.'],
    label: 'Get in touch',
    mail: 'Email me',
    linkedin: 'LinkedIn',
    copyright: 'Nils Vogelaar',
    setIn: 'Set in Geist & Sometype Mono',
  },
  plates: {
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
    back: 'Back to work',
    close: 'Close case study',
    visit: 'Visit live site',
    requestAccess: 'Request access',
    overview: 'Overview',
    credits: 'Credits',
    highlights: 'Specifications',
    gallery: 'Gallery',
    leaf: 'Leaf with ← →',
    next: 'Next',
    prevPlate: 'Previous case',
    nextPlate: 'Next case',
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
