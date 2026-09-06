/**
 * Availability status — set in content.json, rendered in three places
 * (hero eyebrow, about status row, contact status line). The copy per
 * state lives in the i18n ui dictionary so the surfaces never drift.
 */

import { ui, type Lang } from './i18n';

export type AvailabilityState = 'available' | 'limited' | 'unavailable';

export type Availability = {
  state: AvailabilityState;
  /** 'YYYY-MM' — optional "back in …" month for limited/unavailable. */
  availableFrom: string | null;
};

const MONTHS: Record<Lang, string[]> = {
  nl: [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

/** '2026-09' → 'september 2026' / 'September 2026'; invalid input → null. */
export function formatMonth(ym: string | null, lang: Lang): string | null {
  if (!ym) return null;
  const m = ym.match(/^(\d{4})-(\d{2})$/);
  if (!m) return null;
  const month = MONTHS[lang][Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : null;
}

export type AvailabilityCopy = {
  hero: string;
  about: string;
  contact: string;
  /** The seal — the colophon's primary CTA label, kept honest per state. */
  cta: string;
};

export function availabilityCopy(availability: Availability, lang: Lang): AvailabilityCopy {
  const t = ui[lang].availability;
  const base = t[availability.state];
  const back = formatMonth(availability.availableFrom, lang);
  const suffix =
    back && availability.state !== 'available' ? ` — ${t.backIn} ${back}` : '';

  return {
    hero: base.hero,
    about: `${base.about}${suffix}`,
    contact: `${base.contact}${suffix}`,
    cta: base.cta,
  };
}
