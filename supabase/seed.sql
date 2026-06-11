-- ============================================================
-- Portfolio CMS — seed
-- Vult de database met de huidige site-content. Eén keer uitvoeren
-- ná schema.sql. Bestaande rijen worden niet overschreven.
-- ============================================================

insert into public.site_settings (id, availability_state, available_from, about, skills, contact)
values (
  1,
  'available',
  null,
  $json${
    "intro": "Four years building web and mobile products, mostly for scale-ups and founders who need a developer that thinks like a product person. At Autodisk I took FleetDisk from an unfinished internal tool to a polished platform now running live fleets for companies like Van Mossel.",
    "body": "My stack spans Vue, Nuxt, React, Angular, Ionic, Node.js, and C++. I'm deeply fluent in AI tools and build them into every project to move faster without cutting corners. What stays constant is how I work: directly, communicatively, and like the product is mine.",
    "details": [
      { "label": "Based in", "value": "Amsterdam, NL" },
      { "label": "Experience", "value": "4+ years" },
      { "label": "Focus", "value": "Web & Mobile" }
    ]
  }$json$::jsonb,
  $json${
    "intro": "The stack follows the problem, never the other way around. Here is what I reach for, and when.",
    "picks": [
      { "tools": "Vue, Nuxt", "when": "Default for fast, reactive front-ends. Forms that don’t thrash, tables with thousands of rows, anything that lives." },
      { "tools": "React", "when": "When the team already knows it, the ecosystem matters more than ergonomics, or a library only ships React." },
      { "tools": "Ionic, Capacitor", "when": "One codebase to iOS, Android, and the web. For when two native teams isn’t in the budget." },
      { "tools": "TypeScript", "when": "Always. Plain JS is debt the moment a second person opens the file." },
      { "tools": "Node.js, REST, SQL", "when": "Backend glue: APIs, schedulers, integrations. Boring on purpose." },
      { "tools": "Figma, Tailwind", "when": "Where the design happens, and what gets it shipped without a translation step." }
    ]
  }$json$::jsonb,
  $json${
    "email": "softwaresolutions.nv@gmail.com",
    "location": "Amsterdam",
    "socials": [
      { "label": "LinkedIn", "href": "https://www.linkedin.com/in/nils-v-342b55176/" },
      { "label": "GitHub", "href": "https://github.com/softwaresolutionsnv-droid" }
    ]
  }$json$::jsonb
)
on conflict (id) do nothing;

insert into public.admin_settings (id)
values (1)
on conflict (id) do nothing;

insert into public.projects
  (slug, title, description, lede, tags, role, year, client, url, image, image_alt, color, overview, highlights, gallery, show_badge, show_cta, published, sort_order)
values
(
  'berijdersapp',
  'BerijdersApp',
  $q$White-label mobile app for lease drivers. One overview for contract, mileage, damage reports, fines, and a fuel-score derived from every fill-up. Replaces the paper driver handbook with a tap-to-act digital version.$q$,
  $q$A driver handbook reduced to taps. Fines, mileage, fuel, damages: every annoyance of leasing collapses into one screen.$q$,
  array['Vue.js', 'TypeScript', 'Ionic', 'Capacitor'],
  'Frontend Developer',
  '2025',
  'Autodisk',
  'https://www.autodisk.nl/leasemaatschappij/berijdersapp/',
  '/projects/berijdersapp.jpg',
  'BerijdersApp mobile screens showing lease contract overview, mileage, and fuel consumption score',
  'oklch(0.22 0.05 230)',
  array[
    $q$BerijdersApp replaces the paper driver handbook that comes with every lease vehicle. Drivers get one tap-to-act surface for their contract, mileage, damages, fines, and fuel card. No phone calls, no email chains.$q$,
    $q$The app is white-labeled per lease company: brand, copy, and enabled modules all driven by configuration. A single Ionic/Capacitor codebase ships to iOS and Android, with shared logic between the app and Autodisk’s wider web platform.$q$,
    $q$The fuel-score is the interesting part: every fill-up the driver logs is normalised against vehicle, route, and climate, then surfaced as a running score. It turns a back-office KPI into something a driver actually engages with.$q$
  ],
  $json$[
    { "label": "Platform", "value": "iOS · Android · Web" },
    { "label": "Shipped", "value": "White-label, 6 lease companies" },
    { "label": "Scope", "value": "Contract, damage, fines, fuel-score" },
    { "label": "Team", "value": "Solo frontend, in-house designer" }
  ]$json$::jsonb,
  '[]'::jsonb,
  false,
  false,
  true,
  0
),
(
  'fleetdisk',
  'FleetDisk',
  $q$Self-service fleet management portal for lease companies. 24/7 insight into damages, fines, fuel cards, insurance, and lease orders: one pane over what used to be five separate back-offices.$q$,
  $q$Thirty years of enterprise fleet data, made scannable in three seconds. The control surface five back-offices used to need.$q$,
  array['Nuxt.js', 'Vue.js', 'TypeScript', 'Bootstrap'],
  'Frontend Developer',
  '2024',
  'Autodisk',
  null,
  '/projects/fleetdisk.jpg',
  'FleetDisk fleet management portal showing vehicle overview and dashboard analytics',
  'oklch(0.20 0.04 220)',
  array[
    $q$FleetDisk is the self-service portal lease companies use to run a live fleet. 24/7 insight into damage reports, fines, fuel cards, insurance, and open lease orders: a single pane over what used to be five legacy back-offices.$q$,
    $q$Built on Nuxt 3 with strict TypeScript on top of the iWise backoffice API. The challenge was not rendering. It was shaping thirty years of enterprise data into something a fleet manager can scan in three seconds.$q$,
    $q$Deep filtering, saved views, and CSV export mean power users stop asking the helpdesk for reports. The helpdesk team got their afternoons back.$q$
  ],
  $json$[
    { "label": "Users", "value": "Fleet managers, B2B" },
    { "label": "Data scale", "value": "100k+ vehicles, live" },
    { "label": "Stack", "value": "Nuxt 3 · TypeScript · REST API" },
    { "label": "Outcome", "value": "Fewer helpdesk tickets" }
  ]$json$::jsonb,
  '[]'::jsonb,
  false,
  false,
  true,
  1
),
(
  'nb-onderhoudsdiensten',
  'N.B. Onderhoudsdiensten',
  $q$Brand identity and marketing site for a Dutch renovation duo. Warm, premium aesthetic built to convert local homeowners. Social proof above the fold, quote CTAs at every decision point.$q$,
  $q$A two-person renovation crew, dressed to look like the firm you would actually trust with your kitchen.$q$,
  array['Next.js', 'TypeScript', 'Tailwind CSS'],
  'Designer',
  '2025',
  'Freelance',
  'https://nbonderhoud.nl/',
  '/projects/nb-onderhoudsdiensten.jpg',
  'N.B. Onderhoudsdiensten hero section with dark background, serif typography, and blue/gold accent colors',
  'oklch(0.18 0.03 240)',
  array[
    $q$N.B. Onderhoudsdiensten is a two-person renovation duo in the Netherlands who needed a brand and a site that punched above their weight. The brief: look like a crew you’d trust with your kitchen, not like a templated contractor.$q$,
    $q$Dark, warm, editorial. Serif typography for confidence, a gold accent for craft, lots of air. Social proof sits above the fold, quote CTAs follow the eye down the page.$q$,
    $q$Built in Next.js with internationalisation (NL/EN) from day one. Sub-second Lighthouse scores across all pages, and a booking flow built to convert.$q$
  ],
  $json$[
    { "label": "Deliverable", "value": "Brand + site + copy" },
    { "label": "Stack", "value": "Next.js · NL/EN · CMS" },
    { "label": "Lighthouse", "value": "98 / 100 / 100 / 100" },
    { "label": "Conversion", "value": "~3× category average" }
  ]$json$::jsonb,
  '[]'::jsonb,
  true,
  true,
  true,
  2
)
on conflict (slug) do nothing;
