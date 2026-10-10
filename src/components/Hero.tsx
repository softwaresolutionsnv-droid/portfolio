import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { BottomBar } from './BottomBar';
import { Dither } from './Dither';
import { Mono, Reveal } from './Reveal';
import { kennismakingLink, siteContent } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';
import { gsap, reducedMotion } from '../lib/motion';

/**
 * Hero — "ruis → signaal". The dither field opens as static and a scan front
 * resolves it into the portrait while a mono readout counts the signal in.
 * The offer runs the full width in display caps; beneath it the practice
 * line and the one primary action. Scrolling away splits the two
 * headline lines and drops the field's resolution. One pause control stops
 * every loop in the hero (WCAG 2.2.2).
 */
export function Hero() {
  const t = useT();
  const loc = useLoc();
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);

  const onSignal = useCallback((p: number) => {
    if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
  }, []);

  /* exit: the two lines part as the hero scrolls away */
  useLayoutEffect(() => {
    const el = section.current;
    if (!el || reducedMotion()) return;
    const lines = el.querySelectorAll<HTMLElement>('h1 > .rv');
    if (lines.length < 2) return;
    const tween = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    lines.forEach((line, i) => {
      tween.to(line, { xPercent: i % 2 ? 14 : -14, ease: 'none' }, 0);
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={section}
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
      aria-label={t.hero.eyebrow}
    >
      <Dither className="absolute inset-0" src="/hero-signal.mp4" poster="/hero-signal.jpg" safe={copy} onSignal={onSignal} paused={paused} />

      <div ref={copy} className="container relative z-[1] pt-[32svh] sm:pt-32 pb-9">
        {/* .hero-text carries the scrim, so the ground under the copy grows with the copy (critique 6 Oct, P1). */}
        <div className="hero-text">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-6">
            <Mono bracket className="block">
              {t.hero.eyebrow}
            </Mono>
            <div className="flex items-baseline gap-5">
              <span className="t-mono tabular-nums" aria-hidden="true">
                [ {t.hero.signaal} <span ref={pct}>000</span>% ]
              </span>
              <button
                type="button"
                className="t-mono hero-pause"
                aria-pressed={paused}
                aria-label={paused ? t.hero.speel : t.hero.pauze}
                onClick={() => setPaused((p) => !p)}
              >
                <span aria-hidden="true">( {paused ? '▶' : '❚❚'} )</span>
              </button>
            </div>
          </div>
          <Reveal as="h1" lines={loc(siteContent.hero.headline)} className="t-display t-display--hero" />

          <div className="grid-12 gap-y-9 items-end mt-8 lg:mt-12">
            <div className="col-span-12 lg:col-span-6">
              <Reveal as="p" className="t-body-lg" delay={0.35} style={{ maxWidth: '36ch' }}>
                {loc(siteContent.hero.practice)}
              </Reveal>
              <a {...kennismakingLink(t.nav.subjectCall)} className="btn btn--solid whitespace-nowrap mt-7">
                {t.nav.planCall} <span className="arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </section>
  );
}
