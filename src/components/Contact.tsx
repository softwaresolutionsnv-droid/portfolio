import { Mark } from './Mark';
import { Mono, Reveal } from './Reveal';
import { siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

/** Contact — the signal field. "Brief me something." */
export function Contact() {
  const t = useT();
  const loc = useLoc();
  const { email, socials, pitch } = siteContent.contact;
  const linkedin = socials.find((s) => s.label === 'LinkedIn') ?? socials[0];

  return (
    <section id="contact" className="flex flex-col" style={{ paddingTop: 'var(--sec-xl)', paddingBottom: 'var(--sec-sm)' }}>
      <div className="container grid-12 gap-y-12 items-start" style={{ paddingBottom: 'var(--sec-md)' }}>
        <div className="col-span-12 lg:col-span-6">
          <Reveal as="h2" lines={t.contact.title} className="t-display" />
          <a href={`mailto:${email}`} className="card mt-10">
            <span className="avatar">
              <Mark size={20} className="text-[rgb(var(--c-off-white))]" />
            </span>
            {email}
          </a>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-7 lg:pt-10">
          <Mono bracket className="block mb-8">
            {t.contact.label}
          </Mono>
          <Reveal as="p" className="t-body-lg" style={{ maxWidth: '30ch' }}>
            {loc(pitch)}
          </Reveal>
          <div className="flex flex-wrap gap-2 mt-10">
            <a href={`mailto:${email}`} className="btn">
              {t.contact.mail} <span className="arrow" aria-hidden="true">↗</span>
            </a>
            <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="btn">
              {t.contact.linkedin} <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div>
        <div className="container flex flex-wrap justify-between gap-x-6 gap-y-1 pb-4 t-mono-sm" style={{ opacity: 0.6 }}>
          <span>
            © {new Date().getFullYear()} {t.contact.copyright}
          </span>
          <span>{t.contact.setIn}</span>
        </div>
      </div>
    </section>
  );
}
