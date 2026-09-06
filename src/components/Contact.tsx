import { motion, useReducedMotion } from 'framer-motion';
import { siteContent } from '../lib/content';
import { availabilityCopy } from '../lib/availability';
import { useLang, useLoc, useT } from '../lib/i18n';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const { email, location, socials } = siteContent.contact;

/**
 * The colophon — the monograph's closing page and the page's second
 * Monument moment. The email seal is the loudest Oxide on the site.
 */
export function Contact() {
  const reduced = useReducedMotion();
  const t = useT();
  const loc = useLoc();
  const { lang } = useLang();
  const status = availabilityCopy(siteContent.availability, lang);
  const r = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 1.0, delay, ease: EASE },
        };

  return (
    <section
      id="contact"
      className="min-h-[100svh] flex flex-col"
      style={{ paddingTop: 'clamp(5rem, 12vh, 10rem)' }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10 flex-1 flex flex-col">
        <div
          className="flex items-baseline justify-between pb-5 mb-14 sm:mb-20"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="t-label" style={{ color: 'var(--text-muted)' }}>
            {t.contact.header}
          </h2>
          <span className="t-index" style={{ color: 'var(--text-muted)' }}>
            {location}
          </span>
        </div>

        <motion.p {...r(0)} className="t-label mb-8" style={{ color: 'var(--text-muted)' }}>
          {t.contact.eyebrow}
        </motion.p>

        {/* A real heading so AT users navigating by heading land on the
            page's closing ask, not just the "Colophon" label above it. */}
        <motion.h3
          {...r(0.1)}
          className="t-monument"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.contact.monument[0]}
          <br />
          {t.contact.monument[1]}
        </motion.h3>

        <motion.p
          {...r(0.25)}
          className="t-serif mt-10"
          style={{
            fontSize: 'clamp(1.0625rem, 1.4vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '50ch',
          }}
        >
          {loc(siteContent.contact.pitch)}
        </motion.p>

        <motion.div
          {...r(0.35)}
          className="flex flex-col sm:flex-row sm:items-center items-start gap-6 mt-12"
        >
          {/* The seal — the page's one Oxide surface. */}
          <a
            href={`mailto:${email}`}
            className="t-label inline-flex items-center gap-2.5 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'oklch(0.96 0.004 90)',
              padding: '18px 36px',
              outlineColor: 'var(--accent-ink)',
              transition: 'background-color 200ms ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)')
            }
          >
            {status.cta} <span aria-hidden="true">↗</span>
          </a>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <a
              href={`mailto:${email}`}
              className="t-index py-3 select-all outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'underline',
                textUnderlineOffset: 6,
                textDecorationColor: 'var(--border)',
                outlineColor: 'var(--accent-ink)',
              }}
            >
              {email}
            </a>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-index py-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 6,
                  textDecorationColor: 'var(--border)',
                  outlineColor: 'var(--accent-ink)',
                }}
              >
                {social.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Status line */}
        <motion.p
          {...r(0.45)}
          className="t-serif mt-12"
          style={{ fontSize: '1rem', color: 'var(--text-muted)' }}
        >
          {status.contact} · {t.contact.replies} · {location}
        </motion.p>

        <div className="flex-1" aria-hidden="true" />

        {/* Legal hairline row */}
        <footer
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-8 mt-16"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p className="t-index m-0" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} {t.contact.copyright}
          </p>
          <p className="t-index m-0 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
            {t.contact.setIn}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="t-index outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              padding: '8px 0',
              cursor: 'pointer',
              outlineColor: 'var(--accent-ink)',
            }}
          >
            {t.contact.backToTop} <span aria-hidden="true">↑</span>
          </button>
        </footer>
      </div>
    </section>
  );
}
