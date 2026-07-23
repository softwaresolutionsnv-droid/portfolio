# Portfolio — nilsvogelaar.com

Portfolio van Nils Vogelaar (freelance developer/designer). React 19 + TypeScript + Vite + Tailwind 4, gehost op Vercel.

## Structuur

- **Publieke site** — `src/components/` + `src/lib/`, één scrollpagina (Hero → Work → About → Stack → Contact) met case-study-overlays op `/work/:slug` (View Transitions API).
- **Admin CMS** — `src/admin/`, lazy-loaded op `/admin`, backed by Supabase (Postgres + Storage + Auth). Setup: `docs/cms-setup.md`.
- **Content** — componenten lezen `src/data/content.json`. `scripts/fetch-content.mjs` regenereert dat bestand bij de build vanuit Supabase (incl. WebP-ladder 640/1280/1920 via sharp). Zonder credentials bouwt de repo op de ingecheckte content.

## Commands

```bash
npm run dev        # dev-server (Vite)
npm run build      # content-sync + sitemap + tsc + vite build
npm run lint       # eslint
npm run cms:sync   # alleen content-sync vanuit Supabase
```

## Environment

`.env.local` (zie `.env.example`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (of `VITE_SUPABASE_PUBLISHABLE_KEY` — beide namen werken)

Zonder deze vars werkt de publieke site volledig; alleen `/admin` en de content-sync staan dan uit.

## Design

Designsysteem en principes: `DESIGN.md` + `PRODUCT.md`. Kort: warm-getinte OKLCH-neutrals, vermillion-accent, Bricolage Grotesque/Figtree, beide thema's first-class, motion alleen waar het iets toevoegt.
