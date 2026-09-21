import { Mono, Reveal } from './Reveal';
import { siteContent } from '../lib/content';
import { availabilityCopy } from '../lib/availability';
import { useLang, useLoc, useT } from '../lib/i18n';

/** About — the culture block, solo edition: big text left, spec card right. */
export function About() {
  const t = useT();
  const loc = useLoc();
  const { lang } = useLang();
  const status = availabilityCopy(siteContent.availability, lang);
  const details = [
    ...siteContent.about.details.map((d) => ({ label: loc(d.label), value: loc(d.value) })),
    { label: t.about.statusLabel, value: status.about },
  ];

  return (
    <section id="about" style={{ paddingTop: 'var(--sec-lg)', paddingBottom: 'var(--sec-xl)' }}>
      <div className="container">
        <Mono className="block mb-[var(--sec-sm)]">{t.about.based}</Mono>
      </div>
      <div className="container grid-12 gap-y-12 items-end">
        <div className="col-span-12 lg:col-span-6">
          <Reveal as="p" className="t-h3" style={{ textIndent: '2.6em', maxWidth: '27ch' }}>
            {loc(siteContent.about.intro)}
          </Reveal>
          <Reveal as="p" className="t-body-md mt-8" delay={0.15} style={{ maxWidth: '48ch' }}>
            {loc(siteContent.about.body)}
          </Reveal>
          <a href={siteContent.contact.socials[0].href} target="_blank" rel="noopener noreferrer" className="btn mt-10">
            {t.about.linkedin} <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <dl
          className="col-span-12 lg:col-span-5 lg:col-start-8 rounded-[4px] p-6 sm:p-8 grid gap-0"
          style={{ background: 'rgb(var(--c-black))', color: 'rgb(var(--c-off-white))' }}
        >
          {details.map((d, i) => (
            <div
              key={d.label}
              className="grid grid-cols-[8rem_1fr] gap-4 py-4"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgb(var(--c-off-white) / 0.15)' }}
            >
              <dt className="t-mono bracket" style={{ opacity: 0.55 }}>
                {d.label}
              </dt>
              <dd className="t-body">{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
