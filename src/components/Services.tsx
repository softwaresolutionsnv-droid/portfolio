import { Mark } from './Mark';
import { Mono, Reveal } from './Reveal';
import { siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';
import { scrollToId } from '../lib/motion';

/** What I do — three groups, three columns, plain lists. Light section. */
export function Services() {
  const t = useT();
  const loc = useLoc();
  const { diensten, intro } = siteContent.services;

  return (
    <section id="services" style={{ paddingTop: 'var(--sec-xl)', paddingBottom: 'var(--sec-lg)' }}>
      <div className="container grid-12 gap-y-8">
        <div className="col-span-12 lg:col-span-5">
          <Reveal as="h2" lines={[t.services.title]} className="t-display-sm" />
          <div className="flex flex-wrap gap-2 mt-8">
            {diensten.map((d) => (
              <button key={d.groep} type="button" className="btn" onClick={() => scrollToId(`dienst-${d.groep}`)}>
                {t.groep[d.groep]}
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Reveal as="p" className="t-h4" style={{ maxWidth: '32ch' }}>
            {loc(intro)}
          </Reveal>
        </div>
      </div>

      <div className="container mt-[var(--sec-md)]">
        <div className="hairline" />
      </div>

      <div className="container grid-12 gap-y-10 pt-8">
        <div className="col-span-12 lg:col-span-5 flex flex-wrap items-center gap-4">
          <p className="t-body">{t.services.tldr}</p>
          <a href={`mailto:${siteContent.contact.email}`} className="card">
            <span className="avatar">
              <Mark size={20} className="text-[rgb(var(--c-off-white))]" />
            </span>
            {siteContent.contact.email}
          </a>
        </div>

        <div className="col-span-12 lg:col-span-7 grid gap-10 sm:grid-cols-3">
          {diensten.map((d) => (
            <div key={d.groep} id={`dienst-${d.groep}`} style={{ scrollMarginTop: '6rem' }}>
              <Mono bracket className="block mb-6" as="h3">
                {t.groep[d.groep]}
              </Mono>
              <ul className="flex flex-col gap-1.5 t-body">
                {d.items.map((it) => (
                  <li key={it.nl}>{loc(it)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
