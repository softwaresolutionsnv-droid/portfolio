import { Reveal } from './Reveal';
import { siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

/**
 * Werkwijze — the answers to "what does it cost", "is my data safe" and
 * "are you available", as a ruled list beside a sticky title. Light section.
 */
export function Werkwijze() {
  const t = useT();
  const loc = useLoc();

  return (
    <section id="werkwijze" style={{ paddingTop: 'var(--sec-xl)', paddingBottom: 'var(--sec-md)' }}>
      <div className="container grid-12 gap-y-10 items-start">
        <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-28">
          <Reveal as="h2" lines={t.werkwijze.title} className="t-display-sm" />
        </div>
        <dl className="col-span-12 lg:col-span-7 lg:col-start-6" style={{ borderBottom: '1px solid var(--ink-20)' }}>
          {siteContent.werkwijze.items.map((w) => (
            <div key={w.label.nl} className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-6 py-6 lg:py-8" style={{ borderTop: '1px solid var(--ink-20)' }}>
              <dt className="t-mono bracket pt-1.5" style={{ opacity: 0.6 }}>
                {loc(w.label)}
              </dt>
              <dd>
                <p className="t-body-lg" style={{ maxWidth: '30ch', textWrap: 'balance' }}>
                  {loc(w.kop)}
                </p>
                <p className="t-body mt-3" style={{ maxWidth: '52ch', opacity: 0.75 }}>
                  {loc(w.tekst)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
