import { useCallback, useEffect, useRef, useState } from 'react';
import { siteContent } from '../lib/content';
import { useLang, useT } from '../lib/i18n';
import { gsap, reducedMotion, ScrollTrigger, typeText } from '../lib/motion';

/** Scroll distance (px) after which the bar wipes away. */
const HIDE_AT = 40;

/** Amsterdam wall clock — [ ● HH : MM : SS ]. */
function Clock() {
  const [now, setNow] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/Amsterdam',
    });
    const tick = () => setNow(fmt.format(new Date()).replace(/:/g, ' : '));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="t-mono inline-flex items-center gap-2">
      <span aria-hidden="true">[</span>
      <span className="dot" aria-hidden="true" />
      <span aria-hidden="true" style={{ fontVariantNumeric: 'tabular-nums' }}>{now}</span>
      <span aria-hidden="true">]</span>
      <span className="sr-only">Amsterdam {now.replace(/ /g, '')}</span>
    </span>
  );
}

/**
 * NL/EN — two pressed-state buttons whose names start with what they show
 * (2.5.3), so "klik EN" works by voice. The knob between them is a pointer
 * convenience only; keyboard and screen readers use the two buttons.
 */
export function LangSwitch() {
  const { lang, setLang } = useLang();
  const t = useT();
  const option = (l: 'nl' | 'en', name: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      aria-label={name}
      lang={l}
      className="py-1 px-1.5"
      style={{ opacity: lang === l ? 1 : 0.72 }}
    >
      {l.toUpperCase()}
    </button>
  );
  return (
    <span role="group" aria-label={t.nav.lang} className="t-mono inline-flex items-center gap-0.5 -mx-1.5">
      {option('nl', t.nav.langNl)}
      <span
        aria-hidden="true"
        onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')}
        style={{
          position: 'relative',
          width: 22,
          height: 10,
          borderRadius: 5,
          background: 'var(--ink-20)',
          display: 'inline-block',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: lang === 'nl' ? 2 : 14,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: 'var(--ink)',
            transition: 'left 300ms var(--ease-out)',
          }}
        />
      </span>
      {option('en', t.nav.langEn)}
    </span>
  );
}

/** Label that types in and out; the invisible copy holds the width and the accessible text. */
function Typed({ text }: { text: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span style={{ opacity: 0 }}>{text}</span>
      <span data-type aria-hidden="true" className="absolute inset-0" />
    </span>
  );
}

/**
 * The ruled meta bar of the hero: the last row of its flow, so it sits on
 * the viewport bottom at the top of the page and never over the CTA. The
 * first scroll wipes it — the rule retracts to the left, labels type out —
 * and returning to the top types it back in.
 */
export function BottomBar() {
  const t = useT();
  const { lang } = useLang();
  const { socials } = siteContent.contact;
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  const play = useCallback((dir: 'in' | 'out') => {
    const bar = ref.current;
    if (!bar) return;
    /* Tabbing into the bar scrolls it into view; wiping it then would make the
       focused link inert and drop focus to <body>. It leaves on focusout instead. */
    if (dir === 'out' && bar.contains(document.activeElement)) return;
    shown.current = dir === 'in';
    bar.inert = dir === 'out';
    const instant = reducedMotion();
    bar.querySelectorAll<HTMLElement>('[data-type]').forEach((el) =>
      typeText(el, dir, el.previousElementSibling?.textContent ?? '', dir === 'in' ? 650 : 450)
    );
    gsap.to(bar.querySelector('.hairline'), {
      scaleX: dir === 'in' ? 1 : 0,
      duration: instant ? 0 : dir === 'in' ? 0.9 : 0.55,
      ease: dir === 'in' ? 'power4.out' : 'power2.in',
      overwrite: true,
    });
    gsap.to(bar.querySelectorAll('[data-fade]'), {
      autoAlpha: dir === 'in' ? 1 : 0,
      duration: instant ? 0 : dir === 'in' ? 0.5 : 0.25,
      delay: instant || dir === 'out' ? 0 : 0.3,
      overwrite: true,
    });
  }, []);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    gsap.set(bar.querySelector('.hairline'), { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(bar.querySelectorAll('[data-fade]'), { autoAlpha: 0 });
    bar.inert = true;
    const intro = gsap.delayedCall(0.4, () => {
      if (window.scrollY < HIDE_AT) play('in');
    });
    const st = ScrollTrigger.create({
      start: HIDE_AT,
      onEnter: () => play('out'),
      onLeaveBack: () => play('in'),
    });
    const onFocusOut = (e: FocusEvent) => {
      if (!bar.contains(e.relatedTarget as Node | null) && window.scrollY >= HIDE_AT) play('out');
    };
    bar.addEventListener('focusout', onFocusOut);
    return () => {
      intro.kill();
      st.kill();
      bar.removeEventListener('focusout', onFocusOut);
    };
  }, [play]);

  // A language switch retypes the visible labels in the new language.
  useEffect(() => {
    if (shown.current) play('in');
  }, [lang, play]);

  return (
    <div ref={ref} className="container bottombar">
      <div className="hairline" />
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 t-mono">
        <Typed text={t.hero.role} />
        <span className="hidden sm:inline">
          <Typed text={t.hero.city} />
        </span>
        <span className="hidden md:inline-flex" data-fade>
          <Clock />
        </span>
        <span className="ml-auto hidden sm:inline" style={{ opacity: 0.6 }}>
          <Typed text={t.hero.follow} />
        </span>
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
            <Typed text={s.label} />{' '}
            <span aria-hidden="true" data-fade>
              +
            </span>
          </a>
        ))}
        <span data-fade>
          <LangSwitch />
        </span>
      </div>
    </div>
  );
}
