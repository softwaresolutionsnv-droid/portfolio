import { Dither } from './Dither';
import { Mono, Reveal } from './Reveal';
import { siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

/**
 * Hero — the dither field fills the viewport; the promise sits at the
 * bottom-left in display caps, the practice line bottom-right.
 */
export function Hero() {
  const t = useT();
  const loc = useLoc();

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden" aria-label={t.hero.eyebrow}>
      <Dither className="absolute inset-0" />
      {/* bottom scrim so the headline sits on ground, not on glyphs */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgb(var(--c-dark) / 0.92) 0%, rgb(var(--c-dark) / 0.7) 40%, rgb(var(--c-dark) / 0) 100%)' }}
      />

      <div className="container relative grid-12 items-end gap-y-8 pt-32 pb-24">
        <div className="col-span-12 lg:col-span-8">
          <Mono bracket className="block mb-6">
            {t.hero.eyebrow}
          </Mono>
          <Reveal as="h1" lines={loc(siteContent.hero.headline)} className="t-display" style={{ textWrap: 'balance' }} />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:pb-2">
          <Reveal as="p" className="t-body-lg" delay={0.35} style={{ maxWidth: '34ch' }}>
            {loc(siteContent.hero.practice)}
          </Reveal>
        </div>
      </div>

    </section>
  );
}
