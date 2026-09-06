import { useT } from '../lib/i18n';

/* ponytail: bespoke diagram for the one werkstuk without a visual surface
   (garmin-mcp); generalise to a content-driven diagram model when a second
   diagram-werkstuk appears. */

/**
 * The diagram — the plate image for invisible software (CONTEXT.md).
 * A typeset architecture drawing in the monograph's own language:
 * hairline-ruled nodes, engraved labels, arrows as typeset characters.
 * Duotone by design; it never develops because it carries no color.
 */

function Node({
  title,
  note,
  emphasized = false,
}: {
  title: string;
  note: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className="flex flex-col justify-center px-6 py-5"
      style={{
        border: `1px solid ${emphasized ? 'var(--border)' : 'var(--border-subtle)'}`,
        backgroundColor: emphasized ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      }}
    >
      <span
        className="t-headline"
        style={{
          fontSize: emphasized ? '1.125rem' : '0.9375rem',
          color: emphasized ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}
      >
        {title}
      </span>
      <span className="t-index mt-2" style={{ color: 'var(--text-muted)' }}>
        {note}
      </span>
    </div>
  );
}

/** ↓ in the stacked mobile composition, → in the ruled desktop row. */
function Arrow() {
  const style = { fontSize: '1.375rem', color: 'var(--text-muted)', lineHeight: 1 };
  return (
    <div aria-hidden="true" className="flex items-center justify-center">
      <span className="t-serif sm:hidden" style={style}>
        ↓
      </span>
      <span className="t-serif hidden sm:inline" style={style}>
        →
      </span>
    </div>
  );
}

export function McpDiagram({ alt }: { alt: string }) {
  const t = useT();
  const d = t.diagram;

  return (
    <div
      role="img"
      aria-label={alt}
      className="w-full"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: 'clamp(1.5rem, 4vw, 3.5rem)',
      }}
    >
      {/* Protocol rule — the drawing's engraved caption line. */}
      <p
        className="t-label pb-4 mb-8"
        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        {d.protocol}
      </p>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-[1fr_auto_1.5fr_auto_1fr] sm:items-stretch">
        <Node title={d.assistant} note={d.assistantNote} />
        <Arrow />
        <div className="flex flex-col">
          <Node title={d.server} note={d.serverNote} emphasized />
          <p className="t-index mt-3" style={{ color: 'var(--text-muted)' }}>
            {d.serverAuth}
          </p>
        </div>
        <Arrow />
        <div className="flex flex-col gap-4">
          <Node title={d.garmin} note={d.garminNote} />
          <Node title={d.hevy} note={d.hevyNote} />
        </div>
      </div>
    </div>
  );
}
