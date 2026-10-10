import { Mono, Reveal } from './Reveal';
import { openWerkstuk, opensInPlace, siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

const titel = new Map(siteContent.werkstukken.map((w) => [w.slug, w.title]));

/**
 * Oplossingen — the visitor's own sentence in display type, what Nils puts
 * against it, and a black proof tile that opens the werkstuk in place
 * (CONTEXT.md: oplossing). Light section; replaces the old stack lists.
 */
export function Oplossingen() {
  const t = useT();
  const loc = useLoc();

  return (
    <section id="oplossingen" style={{ paddingTop: 'var(--sec-xl)', paddingBottom: 'var(--sec-lg)' }}>
      <div className="container grid-12 gap-y-8 items-end" style={{ paddingBottom: 'var(--sec-sm)' }}>
        <Reveal as="h2" lines={t.oplossingen.title} className="col-span-12 lg:col-span-6 t-display-sm" />
        <Reveal as="p" className="col-span-12 lg:col-span-5 lg:col-start-8 t-h4" style={{ maxWidth: '30ch' }}>
          {loc(siteContent.oplossingen.intro)}
        </Reveal>
      </div>

      <ol>
        {siteContent.oplossingen.items.map(({ probleem, aanpak, bewijs, systemen }) => (
          <li key={probleem.nl} className="row">
            <div className="container grid-12 gap-y-6 items-start pt-6 pb-8 lg:pt-8 lg:pb-12">
              {/* The visitor's own week, addressed to them — not a quote: there are no testimonials (product-marketing). */}
              <Reveal as="h3" className="col-span-12 lg:col-span-5 t-h3" style={{ maxWidth: '16ch', textWrap: 'balance' }}>
                {loc(probleem)}
              </Reveal>
              <p className="col-span-12 md:col-span-7 lg:col-span-4 t-body-md lg:pt-2" style={{ maxWidth: '40ch' }}>
                {loc(aanpak)}
              </p>
              {bewijs && (
                <a
                  href={`/work/${bewijs.slug}`}
                  onClick={(e) => {
                    if (!opensInPlace(e)) return;
                    e.preventDefault();
                    openWerkstuk(bewijs.slug);
                  }}
                  data-cursor={`${titel.get(bewijs.slug)} ( + )`}
                  className="proof col-span-12 md:col-span-5 lg:col-span-3 lg:pt-0"
                >
                  <Mono bracket className="block" style={{ opacity: 0.6 }}>
                    {t.oplossingen.bewijs}
                  </Mono>
                  <span className="t-h6 block mt-6">{titel.get(bewijs.slug)}</span>
                  <span className="t-body-sm block mt-1" style={{ opacity: 0.75 }}>
                    {loc(bewijs.feit)}
                  </span>
                  <span className="t-mono paren block mt-5 text-right" aria-hidden="true">
                    +
                  </span>
                </a>
              )}
              {!bewijs && systemen && (
                <div className="proof proof-static col-span-12 md:col-span-5 lg:col-span-3 lg:pt-0">
                  <Mono bracket className="block" style={{ opacity: 0.6 }}>
                    {t.oplossingen.systemen}
                  </Mono>
                  <ul className="t-body-sm mt-6 space-y-1">
                    {systemen.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
