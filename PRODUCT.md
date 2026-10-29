# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Webshops (€0,5–20 mln revenue), mkb service companies with administrative processes, e-commerce and marketing agencies that hire white-label AI and integration capacity, and founders who need a portal, tool or app built (`.agents/product-marketing.md`). Decision-makers are owners/DGAs, operations managers, founders and agency leads. Two readers arrive: the warm lead who got the link, and cold inflow from LinkedIn or outreach who must grasp the offer within seconds. First impressions are high-stakes; the portfolio must project confidence within seconds, then sustain it through the work.

## Product Purpose

The portfolio is Nils's primary sales surface as a freelance developer for automation, integrations and custom software. Success is measured by two actions:

1. **Reach out.** A qualified prospect books a kennismaking (intro call); the mail address is the fallback until a calendar link exists.
2. **Remember.** A visitor who isn't ready today leaves with enough of an impression to return, or refer, when a relevant project appears.

The site itself is the strongest proof of capability. It should not describe craft, it should demonstrate it.

## Positioning

"Ik koppel je systemen en zet AI aan het werk." Businesses run on manual work between systems (webshop, marketplace, bookkeeping, mail); Nils takes it out, working inside the systems the client already has, as one person from first call to launch (ADR-0006). Proof over promises: the Short Commerce Weekly Report (a hand-written weekly Google Doc replaced by an automatic report with AI commentary on fixed figures), FleetDisk (renewed fleet portal with a dashboard on thirty years of back-office data), and shipped client sites — where competing freelancers show demos and no-code glue. The portfolio site itself is part of that proof.

## Operating Context

- Prospects typically evaluate on a laptop, often between calls or in the evening, comparing candidates; the site must land its case fast.
- Content (werkstukken, availability, hero/oplossingen/werkwijze/about/contact copy) lives in `src/data/content.json` (ADR-0002); updating content is a commit and a deploy.
- Case studies are shareable deep links at `/work/:slug`; prospects may enter the site through one.

## Capabilities and Constraints

- One-page site (hero / oplossingen / work / werkwijze / about / contact) plus case-page overlays at `/work/:slug`. Fully static Vite build; Lenis smooth scroll, GSAP reveals, and an OGL dither shader in the hero, all degrading cleanly under `prefers-reduced-motion`.
- All commercial and factual claims in copy must be real; nothing is invented (no fabricated metrics, clients, or testimonials).
- **Bilingual, NL first.** Dutch is the source language, English the translation (ADR-0003); all copy is `{nl,en}` pairs, chrome copy lives in `src/lib/i18n.tsx`.
- Open decision: e-mail on the own domain (currently a Gmail address).

## Brand Commitments

**Name:** Nils Vogelaar, nilsvogelaar.com. **Voice:** direct and confident; no filler, no hedging; professional but not corporate, personal but not casual.

**Personality: Bold. Precise. Memorable.** The interface should feel like it was made by someone who knows exactly what they're doing.

**Sections own the theme.** There is no user theme toggle (decision of 6 Sep 2026): the page opens dark, turns off-white for oplossingen, back to dark for the work, off-white for werkwijze and about, and closes on the green signal field. Every section is designed for the theme it owns.

**Pinned reference (binding, decision of 6 Sep 2026):** lamalama.com is the visual north star, translated as literally as a solo practice allows — bold grotesk caps at line-height .8, a mono UI voice in `[ brackets ]` and `( + )`, a dither field as hero material, a floating nav with a per-section tagline, a right-hand card stack, work as a ruled list with image strips, section-owned themes, Lenis + GSAP motion. Agency-only elements (team, pitchdeck, awards, client logos, "20+ freaks") are not carried over; what replaces them must be true of one person.

**Anti-references (binding):**
- Template-shaped agency sites: identical project-card grids, generic "Hello, I'm a…" heroes, obligatory testimonial carousels.
- Scroll-jacking as spectacle, and any cursor effect beyond the one halftone wake + label (taken from lamalama, 9 Oct 2026); the dither shader is the one WebGL surface and it stays in the hero.
- SaaS-landing-page portfolios: feature grids, hero-metric templates, pricing-style CTAs applied to a person.
- Dribbble gradient aesthetic: soft purple/pink gradients, gradient text, floating glass cards, 3D blobs.
- Personal-blog informality: lowercase everything, handwritten fonts, cluttered sidebars.
- The retired "Concrete Monograph" world (Archivo Expanded + serif, oxide accent, museum-slow motion) is an anti-reference, not a fallback.

## Evidence on Hand

- Seven werkstukken in `src/data/content.json`, grouped automatisering → maatwerk → sites-merk: Short Commerce Weekly Report (2026, besloten; Nils on design, portal, engine, integrations and AI commentary together with one other developer; shown as a pipeline diagram), FleetDisk, Shaftlab, BerijdersApp, Puik Bouw, NB Projectbouw, 4 Fruit Company.
- Imagery in `/public/projects`: captures of Shaftlab, Puik Bouw, N.B. and 4 Fruit. Work done for Nils's employer (FleetDisk, BerijdersApp) never shows imagery (ADR-0007); those strips show black spec tiles carrying real scope-facts. **Owner still owes:** a portrait for the "this is me" card.
- Hard numbers in content: BerijdersApp 54 white-label apps from one codebase; SC Weekly Report live since 1 Oct 2026 with 3 brands. Every other figure is a scope-fact.
- No testimonials exist; the customer quotes in the marketing doc need a name and permission before use. Future work must not fabricate any.

## Product Principles

1. **Confidence over safety.** Every decision is intentional and committed. No hedge designs, no timid defaults.
2. **The work is the hero.** Everything else exists to frame the projects; when chrome competes with content, chrome loses.
3. **First impression is a promise.** The above-the-fold experience sets the bar the rest of the site has to clear.
4. **Earn every motion.** Animation improves comprehension or delight, or it is cut.
5. **Proof, never claims.** Show shipped work and real numbers; the site never says what it can instead demonstrate.

## Accessibility & Inclusion

- **Target:** WCAG 2.2 AA across color contrast, focus states, keyboard navigation, and semantic structure.
- **Motion:** honor `prefers-reduced-motion`. Information-carrying animation must also work reduced; decorative motion disables cleanly.
- **Typography:** body copy readable at 200% zoom and on small screens; line length capped.
- **Color:** palette verified against common color-vision deficiencies; never rely on color alone to convey state or hierarchy.

## Werkstukselectie (6 sep 2026, bijgewerkt 9 okt 2026)

Alleen werk voor klanten staat in de werk-sectie: Short Commerce Weekly Report (sinds 9 okt 2026, ADR-0006), FleetDisk, Shaftlab, BerijdersApp, Puik Bouw, NB Projectbouw, 4 Fruit Company. Eigen producten en hulpprojecten (Nachtagenda, garmin-mcp) zijn er bewust af — beslissing van de eigenaar. Beeld is altijd een echte opname van de build (live domein of lokale dev-build); 4fruitcompany.nl toont nog de oude WordPress-site, dus de 4fruit-uitsneden worden met de hand opgenomen van 4fruit.vercel.app, de versie die live gaat (`node scripts/capture-artefacts.mjs --slug 4fruit --base https://4fruit.vercel.app`), en de status is pre-launch zonder link. Bij de livegang: `status` op live en `url` op het domein, dan neemt de wekelijkse opname het over.
