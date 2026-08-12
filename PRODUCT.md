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

- Prospects typically evaluate on a laptop, often between calls or in the evening, comparing candidates; the site must land its case fast in either ambient light (both themes are product law, see Brand Commitments).
- Content (projects, availability, about/skills/contact copy) is managed via a custom CMS at `/admin` (Supabase + Vercel deploy hook). The Supabase project is currently paused, so the checked-in `src/data/content.json` is the effective content source; the build works with or without CMS env vars.
- Case studies are shareable deep links at `/work/:slug`; prospects may enter the site through one.

## Capabilities and Constraints

- One-page site (title page / plates / essay / specifications / colophon) plus case-study overlays at `/work/:slug`. Public site is fully static; the CMS is a lazy-loaded admin chunk.
- All commercial and factual claims in copy must be real; nothing is invented (no fabricated metrics, clients, or testimonials).
- **A Dutch (NL) version is planned.** Future work must not hard-code against a second locale; copy architecture should anticipate NL/EN.
- Open decision: e-mail on the own domain (currently a Gmail address).

## Brand Commitments

**Name:** Nils Vogelaar, nilsvogelaar.com. **Voice:** direct and confident; no filler, no hedging; professional but not corporate, personal but not casual.

**Personality: Bold. Precise. Memorable.** The interface should feel like it was made by someone who knows exactly what they're doing.

**Both themes are first-class.** Dark and light are each native and complete, never one retrofitted from the other.

**Anti-references (binding):**
- Template-shaped agency sites: identical project-card grids, generic "Hello, I'm a…" heroes, obligatory testimonial carousels.
- Awwwards-bait: WebGL distortions, cursor trails, scroll-jacking as spectacle.
- SaaS-landing-page portfolios: feature grids, hero-metric templates, pricing-style CTAs applied to a person.
- Dribbble gradient aesthetic: soft purple/pink gradients, gradient text, floating glass cards, 3D blobs.
- Personal-blog informality: lowercase everything, handwritten fonts, cluttered sidebars.
- Derivative originals: no specific site is the north star; the aesthetic must feel authored, not referenced.

## Evidence on Hand

- Three real projects in `src/data/content.json`: BerijdersApp (Autodisk, 2025), FleetDisk (Autodisk, 2024), N.B. Onderhoudsdiensten (freelance, 2025), each with overview, highlights, role, stack.
- Project imagery in `/public/projects`: FleetDisk and N.B. Onderhoudsdiensten present (JPG + WebP ladder); **BerijdersApp image pending from the owner** — the site ships a typographic fallback plate until it lands.
- Client-confirmed claims in content: FleetDisk at 100k+ vehicles live; N.B. site Lighthouse 98/100/100/100 and ~3× category-average conversion.
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
