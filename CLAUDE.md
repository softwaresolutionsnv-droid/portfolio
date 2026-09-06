## Design Context

### Users
Potential freelance clients — businesses, founders, and product teams evaluating whether to hire Nils for a project. They arrive with a job to be done: assess capability and fit quickly. First impressions are high-stakes. The portfolio must project confidence and quality within seconds, then sustain that through the work itself.

### Brand Personality
**Bold. Precise. Memorable.**

Nils is a freelance designer/developer whose portfolio is itself a demonstration of craft. The voice is direct and confident — no filler, no hedging. The tone is professional but not corporate; personal but not casual. The interface should feel like it was made by someone who knows exactly what they're doing.

### Aesthetic Direction
- **Strong typographic hierarchy** — large, intentional type choices. Headlines that command attention.
- **Confident color** — a defined palette with a signature accent. Not timid. Not generic.
- **Spatial clarity** — bold layouts with purposeful negative space, not cluttered or noisy.
- **Both light and dark modes** with a toggle — the dark mode should feel premium; the light mode should feel crisp and editorial.
- **Motion that earns its place** — Framer Motion is in the stack. Use it for transitions and reveals that feel polished, not decorative.
- No strong external references — the aesthetic should feel original, not derivative.

### Design Principles
1. **Confidence over safety** — every design decision should feel intentional and committed. No hedge-designs or timid defaults.
2. **The work is the hero** — layout and chrome exist to frame projects, not compete with them.
3. **First impression is a promise** — the above-the-fold experience must immediately communicate quality and capability.
4. **Earn every motion** — animations should improve comprehension or delight, never distract or slow the user.
5. **Both themes are first-class** — dark mode and light mode should each feel native and complete, not like one is an afterthought.

## Content

`src/data/content.json` is de bron (ADR-0002 — het vroegere CMS/Supabase-paneel is verwijderd); het TypeScript-schema ernaast is `src/lib/content.ts`. Content bijwerken = commit + deploy. Alle tekstvelden zijn `{nl,en}`-paren met Nederlands als brontaal (ADR-0003); chrome-copy (labels, knoppen, aria) leeft in `src/lib/i18n.tsx` — componenten bevatten geen copy. Vocabulaire (werkstuk, herkomst, status, groep, bovenlaag, onderlaag, artefact, trace): `CONTEXT.md`.

Werkstukken staan in drie benoemde groepen in vaste volgorde (apps-ai → mcp-tooling → sites-merk); de array in content.json is voorgesorteerd op groep. `scripts/gen-images.mjs` genereert de 640/1280/1920-WebP-ladder uit `public/projects/*.{png,jpg}` bij elke build. Availability heeft drie states (available / limited / unavailable) plus optionele "weer ruimte in [maand]"-datum; copy in het i18n-woordenboek via `src/lib/availability.ts`.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`softwaresolutionsnv-droid/portfolio`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical triage roles map 1:1 to their default label strings. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
