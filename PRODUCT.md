# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Potential freelance clients: businesses, founders, and product teams evaluating whether to hire Nils for a project. They arrive with a job to be done: assess capability and fit quickly. First impressions are high-stakes. The portfolio must project confidence and quality within seconds, then sustain that through the work itself.

## Product Purpose

The portfolio is Nils's primary sales surface as a freelance designer/developer. Success is measured by two actions:

1. **Reach out.** A qualified prospect books a call or sends a project inquiry.
2. **Remember.** A visitor who isn't ready today leaves with enough of an impression to return, or refer, when a relevant project appears.

The site itself is the strongest proof of capability. It should not describe craft, it should demonstrate it.

## Positioning

Proof over promises. Nils shows live production work — a fleet platform running real fleets for companies like Van Mossel, a white-label driver app shipped to six lease companies — where competing freelancers show mockups and promises. The portfolio site itself is part of that proof: it demonstrates the craft it sells.

## Operating Context

- Prospects typically evaluate on a laptop, often between calls or in the evening, comparing candidates; the site must land its case fast.
- Content (werkstukken, availability, hero/services/about/contact copy) lives in `src/data/content.json` (ADR-0002); updating content is a commit and a deploy.
- Case studies are shareable deep links at `/work/:slug`; prospects may enter the site through one.

## Capabilities and Constraints

- One-page site (hero / work / what I do / about / contact) plus case-page overlays at `/work/:slug`. Fully static Vite build; Lenis smooth scroll, GSAP reveals, and an OGL dither shader in the hero, all degrading cleanly under `prefers-reduced-motion`.
- All commercial and factual claims in copy must be real; nothing is invented (no fabricated metrics, clients, or testimonials).
- **Bilingual, NL first.** Dutch is the source language, English the translation (ADR-0003); all copy is `{nl,en}` pairs, chrome copy lives in `src/lib/i18n.tsx`.
- Open decision: e-mail on the own domain (currently a Gmail address).

## Brand Commitments

**Name:** Nils Vogelaar, nilsvogelaar.com. **Voice:** direct and confident; no filler, no hedging; professional but not corporate, personal but not casual.

**Personality: Bold. Precise. Memorable.** The interface should feel like it was made by someone who knows exactly what they're doing.

**Sections own the theme.** There is no user theme toggle (decision of 6 Sep 2026): the page opens dark, turns off-white for the services and about sections, and closes on the green signal field. Every section is designed for the theme it owns.

**Pinned reference (binding, decision of 6 Sep 2026):** lamalama.com is the visual north star, translated as literally as a solo practice allows — bold grotesk caps at line-height .8, a mono UI voice in `[ brackets ]` and `( + )`, a dither field as hero material, a floating nav with a per-section tagline, a right-hand card stack, work as a ruled list with image strips, section-owned themes, Lenis + GSAP motion. Agency-only elements (team, pitchdeck, awards, client logos, "20+ freaks") are not carried over; what replaces them must be true of one person.

**Anti-references (binding):**
- Template-shaped agency sites: identical project-card grids, generic "Hello, I'm a…" heroes, obligatory testimonial carousels.
- Cursor trails and scroll-jacking as spectacle; the dither shader is the one WebGL surface and it stays in the hero.
- SaaS-landing-page portfolios: feature grids, hero-metric templates, pricing-style CTAs applied to a person.
- Dribbble gradient aesthetic: soft purple/pink gradients, gradient text, floating glass cards, 3D blobs.
- Personal-blog informality: lowercase everything, handwritten fonts, cluttered sidebars.
- The retired "Concrete Monograph" world (Archivo Expanded + serif, oxide accent, museum-slow motion) is an anti-reference, not a fallback.

## Evidence on Hand

- Five werkstukken in `src/data/content.json`: Nachtagenda (own product, pre-launch), BerijdersApp (Autodisk, 2025), garmin-mcp (own product, live), FleetDisk (Autodisk, 2024, confidential), N.B. Onderhoudsdiensten (freelance, 2025), each with bovenlaag, onderlaag, highlights, role, stack; garmin-mcp carries a recorded trace.
- Imagery in `/public/projects`: FleetDisk (one composite) and N.B. Onderhoudsdiensten (viewport captures of the live site, desktop + mobile). **Owner still owes:** BerijdersApp screens, Nachtagenda simulator captures, a portrait for the "this is me" card. Until then those strips show black spec tiles carrying real scope-facts.
- The only hard number in content is FleetDisk at 100k+ vehicles live; every other figure is a scope-fact.
- No testimonials exist; future work must not fabricate any.

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

## Werkstukselectie (6 sep 2026)

Alleen werk voor klanten staat in de werk-sectie: BerijdersApp, Shaftlab, FleetDisk, Puik Bouw, N.B. Onderhoudsdiensten, 4 Fruit Company. Eigen producten en hulpprojecten (Nachtagenda, garmin-mcp) zijn er bewust af — beslissing van de eigenaar. Beeld is altijd een echte opname van de build (live domein of lokale dev-build); 4fruitcompany.nl toont nog de oude WordPress-site, dus de 4fruit-opnames komen uit de lokale build en de status is pre-launch zonder link.
