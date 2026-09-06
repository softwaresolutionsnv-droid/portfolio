import { motion, useReducedMotion } from 'framer-motion';
import { siteContent } from '../lib/content';
import { availabilityCopy } from '../lib/availability';
import { useLang, useLoc, useT } from '../lib/i18n';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** The monograph's essay: serif long-form with a ruled marginalia column. */
export function About() {
  const reduced = useReducedMotion();
  const t = useT();
  const loc = useLoc();
  const { lang } = useLang();

  const status = availabilityCopy(siteContent.availability, lang);
  const details = [
    ...siteContent.about.details.map((d) => ({ label: loc(d.label), value: loc(d.value) })),
    { label: t.about.statusLabel, value: status.about },
  ];

  return (
    <section id="about" style={{ padding: 'clamp(5rem, 12vh, 10rem) 0' }}>
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-10">
        <div
          className="flex items-baseline justify-between pb-5 mb-12 sm:mb-16"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="t-label" style={{ color: 'var(--text-muted)' }}>
            {t.about.header}
          </h2>
        </div>

        <div className="grid gap-12 lg:gap-24 lg:grid-cols-[1fr_minmax(240px,300px)]">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <p
              className="t-serif"
              style={{
                fontSize: 'clamp(1.375rem, 2.2vw, 1.75rem)',
                lineHeight: 1.55,
                color: 'var(--text-primary)',
                maxWidth: '46ch',
              }}
            >
              {loc(siteContent.about.intro)}
            </p>
            <p
              className="t-serif mt-8"
              style={{
                fontSize: '1.1875rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                maxWidth: '58ch',
              }}
            >
              {loc(siteContent.about.body)}
            </p>
          </motion.div>

          {/* Marginalia — ruled detail rows */}
          <motion.dl
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="self-stretch lg:border-l lg:pl-10"
            style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderColor: 'var(--border)' }}
          >
            {details.map((item) => (
              <div
                key={item.label}
                className="py-4"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <dt className="t-label mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  {item.label}
                </dt>
                <dd
                  className="t-serif m-0"
                  style={{ fontSize: '1rem', color: 'var(--text-primary)' }}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
