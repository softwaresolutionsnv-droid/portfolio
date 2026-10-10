import type { Diagram as DiagramData } from '../lib/content';
import { useLoc, useT } from '../lib/i18n';

/**
 * The diagram — the plate for software that has no surface to show
 * (CONTEXT.md): a typeset pipeline on a black tile, one ruled row per
 * step in reading order, the flow carried by a typeset ↓ between rows.
 * Real text, so it reads to assistive tech as an ordered list.
 */
export function Diagram({ diagram }: { diagram: DiagramData }) {
  const t = useT();
  const loc = useLoc();

  return (
    <figure className="flex flex-col gap-2">
      <div className="tile" style={{ background: 'rgb(var(--c-black))', color: 'rgb(var(--c-off-white))', padding: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
        <div className="flex justify-between gap-4 t-mono pb-4" style={{ borderBottom: '1px solid rgb(var(--c-off-white) / 0.2)' }}>
          <span>{loc(diagram.kop)}</span>
          <span className="bracket" style={{ opacity: 0.6 }}>
            {t.diagram.label}
          </span>
        </div>
        <ol>
          {diagram.stappen.map((s, i) => (
            <li key={s.label.nl} className="grid grid-cols-[1.5rem_1fr] sm:grid-cols-[1.5rem_7.5rem_1fr] gap-x-4 gap-y-1 py-4" style={{ borderTop: i === 0 ? 'none' : '1px solid rgb(var(--c-off-white) / 0.12)' }}>
              <span className="t-body row-span-2 sm:row-span-1" aria-hidden="true" style={{ opacity: 0.5 }}>
                {i === 0 ? '·' : '↓'}
              </span>
              <span className="t-mono pt-[3px]" style={{ opacity: 0.6 }}>
                {loc(s.label)}
              </span>
              <span className="col-start-2 sm:col-start-3 sm:row-start-1">
                <span className="t-h6 block">{loc(s.titel)}</span>
                <span className="t-mono-md block mt-1" style={{ opacity: 0.6 }}>
                  {loc(s.noot)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="t-mono-sm" style={{ opacity: 0.6 }}>
        <span className="bracket">{loc(diagram.bijschrift)}</span>
      </figcaption>
    </figure>
  );
}
