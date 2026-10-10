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

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'nl',
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
  baseTitle: 'Nils Vogelaar — Automatisering & koppelingen voor webshops en mkb',
  skip: 'Naar de inhoud',
  nav: {
    taglines: {
      hero: 'AI aan het werk',
      oplossingen: 'Loopt vanzelf',
      work: 'Werk dat draait',
      werkwijze: 'Zo werk ik',
      about: 'Dit ben ik',
      contact: 'Laten we praten',
    },
    menu: 'Menu',
    close: 'Sluiten',
    oplossingen: 'Oplossingen',
    work: 'Werk',
    werkwijze: 'Werkwijze',
    about: 'Over mij',
    contact: 'Contact',
    thisIsMe: 'Dit ben ik',
    planCall: 'Plan een kennismaking',
    startProject: 'Start een project',
    subjectCall: 'Kennismaking',
    subjectProject: 'Nieuw project',
    lang: 'Taal',
    langNl: 'NL, Nederlands',
    langEn: 'EN, English',
    home: 'Naar boven',
  },
  hero: {
    eyebrow: 'Nils Vogelaar',
    role: 'Freelance developer',
    city: 'Amsterdam',
    follow: 'Volg mij',
    signaal: 'Signaal',
    pauze: 'Pauzeer beweging',
    speel: 'Speel beweging af',
  },
  oplossingen: {
    title: ['Het loopt', 'vanzelf.'],
    bewijs: 'Bewijs',
    systemen: 'Bijvoorbeeld',
  },
  work: {
    label: 'Uitgelicht werk',
    view: 'Bekijk',
    openAria: 'Open werkstuk:',
  },
  werkwijze: {
    title: ['Zo werk', 'ik.'],
  },
  about: {
    statusLabel: 'Status',
    linkedin: 'LinkedIn',
  },
  contact: {
    title: ['Waar loop je', 'tegenaan?'],
    label: 'Neem contact op',
    mail: 'Mail me',
    book: 'Plan een kennismaking',
    linkedin: 'LinkedIn',
    copyright: 'Nils Vogelaar',
    setIn: 'Gezet uit Geist & Sometype Mono',
  },
  plates: {
    specClient: 'Opdrachtgever',
    specYear: 'Jaar',
    specRole: 'Rol',
    specStack: 'Stack',
  },
  groep: {
    automatisering: 'Automatisering & koppelingen',
    maatwerk: 'Dashboards, portalen & apps',
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
    book: 'Kennismaking',
    overview: 'Overzicht',
    credits: 'Credits',
    highlights: 'Specificaties',
    leaf: 'Blader met ← →',
    next: 'Volgende',
    prevPlate: 'Vorig werkstuk',
    nextPlate: 'Volgend werkstuk',
  },
  diagram: {
    label: 'Diagram',
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
  baseTitle: 'Nils Vogelaar — Automation & integrations for online stores and SMBs',
  skip: 'Skip to content',
  nav: {
    taglines: {
      hero: 'AI put to work',
      oplossingen: 'Runs by itself',
      work: 'Work that ships',
      werkwijze: 'How I work',
      about: 'This is me',
      contact: "Let's talk",
    },
    menu: 'Menu',
    close: 'Close',
    oplossingen: 'Solutions',
    work: 'Work',
    werkwijze: 'How I work',
    about: 'About',
    contact: 'Contact',
    thisIsMe: 'This is me',
    planCall: 'Book a call',
    startProject: 'Start a project',
    subjectCall: 'Intro call',
    subjectProject: 'New project',
    lang: 'Language',
    langNl: 'NL, Nederlands',
    langEn: 'EN, English',
    home: 'Back to top',
  },
  hero: {
    eyebrow: 'Nils Vogelaar',
    role: 'Freelance developer',
    city: 'Amsterdam',
    follow: 'Follow me',
    signaal: 'Signal',
    pauze: 'Pause motion',
    speel: 'Play motion',
  },
  oplossingen: {
    title: ['Runs by', 'itself.'],
    bewijs: 'Proof',
    systemen: 'For example',
  },
  work: {
    label: 'Featured work',
    view: 'View',
    openAria: 'Open work:',
  },
  werkwijze: {
    title: ['How I', 'work.'],
  },
  about: {
    statusLabel: 'Status',
    linkedin: 'LinkedIn',
  },
  contact: {
    title: ['What\'s holding', 'you back?'],
    label: 'Get in touch',
    mail: 'Email me',
    book: 'Book an intro call',
    linkedin: 'LinkedIn',
    copyright: 'Nils Vogelaar',
    setIn: 'Set in Geist & Sometype Mono',
  },
  plates: {
    specClient: 'Client',
    specYear: 'Year',
    specRole: 'Role',
    specStack: 'Stack',
  },
  groep: {
    automatisering: 'Automation & integrations',
    maatwerk: 'Dashboards, portals & apps',
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
    book: 'Intro call',
    overview: 'Overview',
    credits: 'Credits',
    highlights: 'Specifications',
    leaf: 'Browse with ← →',
    next: 'Next',
    prevPlate: 'Previous case',
    nextPlate: 'Next case',
  },
  diagram: {
    label: 'Diagram',
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
