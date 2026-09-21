import { useEffect, useState } from 'react';
import { siteContent } from '../lib/content';
import { useLang, useT } from '../lib/i18n';

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
    <span className="t-mono inline-flex items-center gap-2" aria-label={`Amsterdam ${now}`}>
      <span aria-hidden="true">[</span>
      <span className="dot" aria-hidden="true" />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{now}</span>
      <span aria-hidden="true">]</span>
    </span>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')}
      aria-label={t.nav.toOtherLang}
      className="t-mono inline-flex items-center gap-2"
    >
      <span style={{ opacity: lang === 'nl' ? 1 : 0.45 }}>NL</span>
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          width: 22,
          height: 10,
          borderRadius: 5,
          background: 'var(--ink-20)',
          display: 'inline-block',
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
      <span style={{ opacity: lang === 'en' ? 1 : 0.45 }}>EN</span>
    </button>
  );
}

/** The ruled meta bar closing the hero and the contact section. */
export function BottomBar({ sticky = false }: { sticky?: boolean }) {
  const t = useT();
  const { socials } = siteContent.contact;
  return (
    <div className={`container ${sticky ? 'bottombar' : ''}`}>
      <div className="hairline" />
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 t-mono">
        <span>{t.hero.role}</span>
        <span className="hidden sm:inline">{t.hero.city}</span>
        <span className="hidden md:inline-flex">
          <Clock />
        </span>
        <span className="ml-auto hidden sm:inline" style={{ opacity: 0.6 }}>
          {t.hero.follow}
        </span>
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
            {s.label} <span aria-hidden="true">+</span>
          </a>
        ))}
        <LangSwitch />
      </div>
    </div>
  );
}
