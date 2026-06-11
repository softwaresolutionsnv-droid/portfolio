# CMS setup

Het CMS draait op [Supabase](https://supabase.com) (database, foto-opslag en login) met een admin-interface op `/admin`. De live site blijft volledig statisch: bij elke publicatie haalt de build de content op en genereert hij de WebP-varianten van geüploade foto's. Zonder Supabase-credentials bouwt de site op de ingecheckte `src/data/content.json` — niets breekt.

## Eenmalige setup (±10 minuten)

### 1. Supabase-project aanmaken

1. Maak een account op [supabase.com](https://supabase.com) en klik **New project** (gratis tier is genoeg).
2. Kies een regio dichtbij (Frankfurt/`eu-central-1`) en een sterk databasewachtwoord (alleen voor noodgevallen — het CMS gebruikt het niet).

### 2. Schema en startdata laden

1. Open in het Supabase-dashboard de **SQL Editor**.
2. Plak en run de inhoud van [`supabase/schema.sql`](../supabase/schema.sql).
3. Plak en run daarna [`supabase/seed.sql`](../supabase/seed.sql) — dit vult de database met de huidige drie projecten en site-teksten.

### 3. Je login-account aanmaken

1. Ga naar **Authentication → Users → Add user → Create new user**.
2. Vul je e-mailadres en een sterk wachtwoord in en vink **Auto Confirm User** aan.
3. Optioneel maar netjes: zet onder **Authentication → Sign In / Up** de optie *Allow new users to sign up* **uit** — jij bent de enige gebruiker.

### 4. Environment-variabelen instellen

Vind onder **Project Settings → API** de *Project URL* en een publieke key (de nieuwe *publishable key* `sb_publishable_…` of de legacy *anon key* — beide werken).

> **Let op:** gebruik exact de namen `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`. Dit is een Vite-project; het `NEXT_PUBLIC_`-prefix dat Supabase in voorbeelden toont werkt hier niet. En omdat de waarden tijdens de build worden ingebakken: na het toevoegen of wijzigen in Vercel altijd **redeployen**.

- **Lokaal**: kopieer `.env.example` naar `.env.local` en vul beide waarden in.
- **Vercel**: zet `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` onder Project → Settings → Environment Variables (alle environments).

### 5. Deploy hook aanmaken (voor de Publiceer-knop)

1. In Vercel: Project → **Settings → Git → Deploy Hooks**.
2. Maak een hook aan, bijvoorbeeld met naam `cms-publish` op branch `main`.
3. Kopieer de URL, log in op `/admin`, ga naar **Site & teksten → Publicatie** en plak hem daar. Opslaan.

Klaar. Vanaf nu:

## Dagelijks gebruik

- **Inloggen**: `https://jouwdomein.nl/admin` (of `http://localhost:5173/admin` bij `npm run dev`).
- **Project toevoegen/bewerken**: Projecten → Nieuw project. Foto's upload je als JPG/PNG; WebP-varianten (640/1280/1920) worden automatisch gegenereerd bij publicatie. Projecten op **Concept** verschijnen nooit op de site.
- **Volgorde**: versleep projecten in de lijst.
- **Beschikbaarheid**: Dashboard → kies Beschikbaar / Beperkt / Niet beschikbaar, optioneel met "weer beschikbaar vanaf". Dit stuurt de statusregels in de hero, about en contact.
- **Publiceren**: opslaan in het CMS zet nog niets live. De knop **Publiceer site** (Dashboard) triggert een nieuwe Vercel-build; na ±1 minuut staat alles live.

## Hoe het technisch werkt

```
/admin (React + shadcn, lazy chunk)
   │  lezen/schrijven via supabase-js (RLS: alleen ingelogd mag schrijven)
   ▼
Supabase ── Postgres (projects, site_settings, admin_settings)
        └── Storage  (bucket project-images, publiek leesbaar)

Publiceer-knop ──POST──▶ Vercel deploy hook
                              │
                              ▼
                 npm run build op Vercel:
                 scripts/fetch-content.mjs
                   • haalt gepubliceerde projecten + instellingen op (anon key)
                   • downloadt nieuwe foto's, genereert WebP-ladder (sharp)
                   • schrijft src/data/content.json
                 daarna tsc + vite build → 100% statische site
```

- `src/data/content.json` is ingecheckt als fallback/seed; de build overschrijft hem wanneer credentials aanwezig zijn. Lokaal kun je hem verversen met `npm run cms:sync`.
- Beeldverwijzingen die met `/` beginnen (zoals de drie bestaande projecten) wijzen naar bestanden in `public/projects/` en worden niet opnieuw verwerkt.
- Mislukt het ophalen terwijl credentials wél gezet zijn, dan faalt de build bewust — liever een rode deploy dan stilletjes verouderde content live zetten.

## Beveiliging

- De `anon key` is publiek by design; Row Level Security beperkt anoniem verkeer tot **lezen** van gepubliceerde content. Schrijven kan alleen met jouw login.
- De deploy hook-URL staat in `admin_settings`, alleen leesbaar voor ingelogde gebruikers. Het ergste dat iemand met die URL zou kunnen doen is een extra build triggeren.
