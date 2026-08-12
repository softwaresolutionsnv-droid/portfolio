/**
 * Availability status — set from the CMS, rendered in three places
 * (hero eyebrow, about status row, contact status line). The copy per
 * state lives here so the three surfaces never drift apart.
 */

export type AvailabilityState = 'available' | 'limited' | 'unavailable';

export type Availability = {
  state: AvailabilityState;
  /** 'YYYY-MM' — optional "back in …" month for limited/unavailable. */
  availableFrom: string | null;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2026-09' → 'September 2026'; invalid input → null. */
export function formatMonth(ym: string | null): string | null {
  if (!ym) return null;
  const m = ym.match(/^(\d{4})-(\d{2})$/);
  if (!m) return null;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : null;
}

export type AvailabilityCopy = {
  /** Hero eyebrow — short, sits at the end of a long line. */
  hero: string;
  /** About "Status" detail row. */
  about: string;
  /** Contact living status line. */
  contact: string;
  /** The seal — the colophon's primary CTA label, kept honest per state. */
  cta: string;
};

export function availabilityCopy(availability: Availability): AvailabilityCopy {
  const back = formatMonth(availability.availableFrom);
  const suffix = back ? ` — back in ${back}` : '';

  switch (availability.state) {
    case 'limited':
      return {
        hero: 'Limited availability',
        about: `Limited availability${suffix}`,
        contact: `Limited availability for new projects${suffix}`,
        cta: 'Email me',
      };
    case 'unavailable':
      return {
        hero: 'Fully booked',
        about: `Fully booked${suffix}`,
        contact: `Not taking new projects${suffix}`,
        cta: 'Email me anyway',
      };
    default:
      return {
        hero: 'Available',
        about: 'Available for projects',
        contact: 'Available for new projects',
        cta: 'Email me',
      };
  }
}
