---
name: Nils Vogelaar — Portfolio
description: Freelance developer and designer portfolio; warm-tinted OKLCH system with a single vermillion beacon.
colors:
  ember: "oklch(0.65 0.22 25)"
  ember-deep: "oklch(0.58 0.22 25)"
  ember-subtle: "oklch(0.65 0.08 25)"
  graphite-bg: "oklch(0.12 0.008 50)"
  graphite-surface: "oklch(0.16 0.008 50)"
  graphite-elevated: "oklch(0.20 0.008 50)"
  graphite-text: "oklch(0.93 0.008 50)"
  graphite-text-secondary: "oklch(0.65 0.01 50)"
  graphite-text-muted: "oklch(0.45 0.008 50)"
  graphite-border: "oklch(0.25 0.008 50)"
  graphite-border-subtle: "oklch(0.20 0.006 50)"
  paper-bg: "oklch(0.97 0.006 50)"
  paper-surface: "oklch(0.93 0.007 50)"
  paper-elevated: "oklch(0.89 0.008 50)"
  paper-text: "oklch(0.17 0.010 50)"
  paper-text-secondary: "oklch(0.38 0.012 50)"
  paper-text-muted: "oklch(0.56 0.008 50)"
  paper-border: "oklch(0.82 0.007 50)"
  paper-border-subtle: "oklch(0.88 0.006 50)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 8vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-compact:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  eyebrow:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  sm: "6px"
  md: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "128px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.ember-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-text}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  tag:
    backgroundColor: "{colors.graphite-surface}"
    textColor: "{colors.graphite-text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Nils Vogt — Portfolio

## 1. Overview

**Creative North Star: "The Signal Fire"**

A warm-tinted neutral ground, almost black at rest, with a single vermillion beacon that appears only where it matters most. The portfolio is built on the idea that confidence is quiet by default and loud on purpose. Surfaces are flat and editorial; the accent is rare, not generic.

The system rejects the visual vocabulary of contemporary portfolio templates. No gradient text, no glassmorphism cards, no decorative cursor trails, no SaaS-landing hero metrics, no identical project grids. The personality is *bold, precise, memorable* and the interface earns that by committing to a small set of strong choices, not by accumulating decoration.

The site's one sanctioned spectacle is **kinetic typography**: type that responds to scroll momentum and paces reading. Every other award-site convention it adopts (preloader, contextual cursor, footer finale, live time) is functional chrome in service of that signature, specified in §5a. Anything outside that list remains banned.

Both themes are first-class. Dark is the default — a warm graphite canvas meant to sit behind work. Light is crisp and editorial, like good magazine paper. Neither is a retrofit.

**Key Characteristics:**
- Warm-tinted OKLCH neutrals (hue 50, chroma ~0.008) — never pure `#000` or `#fff`
- A single accent: vermillion Ember, used on roughly 5–10% of any screen
- Large fluid display type with tight leading; long-form body capped at ~52ch
- Sharp-edged primary actions; nothing is uncommittedly rounded
- Flat surfaces with one purposeful shadow role and one purposeful blur role
- Framer Motion ease-out-expo for entrances, `layoutId` springs for continuity

## 2. Colors

A two-family palette — warm graphite and warm paper — plus one vermillion accent. Every neutral carries a trace of red-orange hue (hue 50) so nothing is sterile. OKLCH is the source of truth; the Stitch linter will flag the frontmatter values and that is accepted.

### Primary
- **Ember** (`oklch(0.65 0.22 25)`): the single accent. Reserved for the primary CTA surface, the active-section underline in the nav, the hero word emphasis, selection highlight, and focus rings. If Ember appears more than once per viewport at rest, the design has lost discipline.
- **Ember Deep** (`oklch(0.58 0.22 25)`): hover state for the primary button. Never used decoratively.
- **Ember Subtle** (`oklch(0.65 0.08 25)`): for low-chroma echoes of the accent (quiet highlights, disabled-accent states). Use sparingly.

### Neutral — Dark (default theme, "Graphite Warm")
- **Graphite BG** (`oklch(0.12 0.008 50)`): page canvas.
- **Graphite Surface** (`oklch(0.16 0.008 50)`): hover backgrounds on nav items; rail card fill.
- **Graphite Elevated** (`oklch(0.20 0.008 50)`): case-study overlays and modal surfaces.
- **Graphite Text** (`oklch(0.93 0.008 50)`): primary text on dark.
- **Graphite Text Secondary** (`oklch(0.65 0.01 50)`): body paragraphs, inactive nav.
- **Graphite Text Muted** (`oklch(0.45 0.008 50)`): eyebrow, metadata, footer.
- **Graphite Border** (`oklch(0.25 0.008 50)`): dividers with presence.
- **Graphite Border Subtle** (`oklch(0.20 0.006 50)`): section rules and footer hairlines.

### Neutral — Light (alt theme, "Paper")
- **Paper BG** (`oklch(0.97 0.006 50)`): page canvas, intentionally warmer than white.
- **Paper Surface** (`oklch(0.93 0.007 50)`): hover fills.
- **Paper Elevated** (`oklch(0.89 0.008 50)`): case-study surfaces.
- **Paper Text** (`oklch(0.17 0.010 50)`): primary text — near-black with a whisper of warmth.
- **Paper Text Secondary** (`oklch(0.38 0.012 50)`): body paragraphs.
- **Paper Text Muted** (`oklch(0.56 0.008 50)`): metadata.
- **Paper Border** / **Paper Border Subtle**: dividers.

### Named Rules

**The One Beacon Rule.** Ember appears on at most one surface per viewport at rest. The primary CTA. The active nav underline. A single emphasized word. Never two at once. Its rarity is what gives it weight.

**The Tinted Neutrals Rule.** No neutral is hue 0. Every greyscale value carries hue 50 at chroma 0.006–0.012. Pure `#000` and `#fff` are banned.

**The OKLCH Source of Truth Rule.** OKLCH values ship directly in the frontmatter and CSS variables. Hex approximations are not maintained in parallel. If a tool needs hex, it converts from OKLCH.

## 3. Typography

**Display Font:** Bricolage Grotesque (system-ui fallback) — a contemporary geometric with optical-size axis. Tight letter-spacing and weight 700 for headlines.
**Body Font:** Figtree (system-ui fallback) — humanist sans with full italic support. Variable weight 300–900.

**Character:** Confident and editorial. Bricolage has just enough personality in its curves to feel authored rather than neutral; Figtree keeps body copy unhurried and readable. The pairing reads as *designer-developer, not agency boilerplate*.

### Hierarchy
- **Display** (700, `clamp(2.8rem, 8vw, 7rem)`, line-height 0.95, tracking −0.02em): hero headline only. One per page.
- **Headline** (700, `clamp(1.875rem, 4vw, 3rem)`, line-height 1.1, tracking −0.015em): section openers ("Let's work together.", "Selected Work").
- **Title** (600, 1.125rem, line-height 1.3): project card titles, case-study subheads.
- **Body** (400, 1.125rem, line-height 1.7): long-form paragraphs. Width capped at `52ch` in hero, `65ch` elsewhere.
- **Body Compact** (400, 1rem, line-height 1.6): dense contexts — case-study highlights, footer.
- **Label** (500, 0.875rem, tracking 0.02em): buttons, nav links, tags. Case left as set.
- **Eyebrow** (500, 0.875rem, tracking 0.04em, **uppercase**): the single small line above a hero headline. Uppercase is reserved for this role.

### Named Rules

**The One Display Rule.** A page gets exactly two Display-scale moments, a full page apart: the hero headline that opens it and the footer finale ("Let's work together.") that closes it. Nothing between them reaches Display scale, and two Displays in one viewport remains banned. Secondary pages use Headline instead.

**The Measure Rule.** Body paragraphs cap at 52–65ch. Never full-width body on a wide viewport.

**The Uppercase-Is-Eyebrow Rule.** The only uppercase text in the system is the eyebrow above a headline. Buttons, nav, and labels keep their natural case. No UPPERCASE CTAs.

## 4. Elevation

The system is flat by default. Depth is carried by tonal layering — Graphite BG, Surface, Elevated form an ordered stack — not by shadows. Shadows appear in three disciplined roles only.

### Shadow Vocabulary
- **Project image hover** (`box-shadow: 0 20px 60px -12px oklch(0 0 0 / 0.3)`): applied to project images on hover inside the work rail. A soft, low, warm shadow; signals affordance, not elevation.
- **Nav scroll state** (`backdrop-filter: blur(16px) saturate(1.2)` + `background: oklch(from var(--bg) l c h / 0.7)`): the only sanctioned blur in the system. Appears on the fixed nav after 40px of scroll and nowhere else.
- **Case-study close button** (`background: oklch(0 0 0 / 0.72)` on hover): a dark disk for controls that sit over imagery.

### Named Rules

**The Flat-Until-State Rule.** Resting surfaces are flat. Shadows are a *response* — to hover, to scroll, to a control that must float over content. Never decoration.

**The One Blur Rule.** Backdrop blur is allowed exactly once: the nav bar during scroll. Cards do not blur. Modals do not blur. Glassmorphism as an aesthetic is banned.

## 5. Components

### Buttons
- **Shape:** sharp-edged — `border-radius: 0`. The decision is intentional; rounded corners soften the brand.
- **Primary:** Ember background, white text, Label typography, padding `14px 28px` (roughly `py-3.5 px-7`). Hover → Ember Deep. Primary buttons are rare — one per section at most.
- **Secondary ("ghost"):** transparent fill, 1px border at `var(--border)`, primary text color. Hover → surface-filled (`var(--bg-surface)`). Used for "View Work" alongside a primary CTA.
- **Link-action:** inline-flex with a trailing `ArrowUpRight` (Lucide, 14–16px). Used for external links (email, socials). Hover → `opacity: 0.7`.
- **Focus:** 2px Ember outline offset 2px. Visible on keyboard only.

### Navigation
- **Shape:** fixed top bar, 64px tall, `max-w-6xl` container.
- **At rest:** fully transparent background, no border.
- **Scrolled (>40px):** translucent canvas `oklch(from var(--bg) l c h / 0.7)` with `backdrop-filter: blur(16px) saturate(1.2)` and a 1px subtle border.
- **Link:** Label typography, 6–12px padding, rounded-sm (6px) hover fill. Inactive color is text-secondary; active is text-primary.
- **Active indicator:** 2px Ember underline, `layoutId="nav-indicator"`, spring `stiffness: 380, damping: 30`. This is the only spring in the system.
- **Theme toggle:** icon-only (Sun/Moon from Lucide), same padding as links, icon rotates and scales on swap.

### Project Cards (the primary content pattern)
- **No container chrome.** Cards are a title, metadata row, image, and description — separated by type hierarchy, not borders. Cards are explicitly NOT boxed.
- **Image:** aspect-ratio preserved, no crop. Wrapped in `.project-image-wrap` for the hover shadow.
- **Hover:** image lifts with `translateY(-4px)` and the project-image hover shadow appears. Title shifts to Ember over 200ms.
- **Tags:** the Tag component — pill-shaped, Graphite Surface fill, Label type.
- **No icons-and-heading identical grid.** Project cards vary in image aspect ratio; they are not cloned tiles.

### Tags / Chips
- **Shape:** pill (`border-radius: 9999px`).
- **Style:** Graphite Surface fill, text-secondary color, Label typography, padding `4px 10px`.
- **No hover state** — tags are metadata, not interactive targets.

### Section Rules (the horizontal hairline)
- 1px high, `var(--border)` color, transform-origin left, `scaleX` sweep on entrance over 900ms ease-out-expo. This hairline is a signature motion — don't replace it with a static `<hr>`.

### Signature: The Hero Reveal
- Each visual line of the hero headline lives inside an `overflow-hidden` mask and slides up from `y: 110% opacity: 0` to `y: 0 opacity: 1`. Staggered by 100ms. Ease-out-expo over 800ms.
- The accented word (`work.`) gets a subtle scale pulse `[1, 1.06, 1]` 300ms after the line settles. This pulse is unique to the hero; do not reuse it.
- The reveal holds until the preloader veil starts lifting, so the visitor always sees it play (never half-finished behind the veil).
- On exit (scrolling away), the hero lines shear apart horizontally (max ±7%) while the block fades. Transform/opacity only.

## 5a. Kinetic Type & Sanctioned Award Chrome

The site's signature is kinetic typography. These patterns are the complete sanctioned list; each exists to pace comprehension, signal affordance, or close the sale, never as free-floating decoration.

### Velocity Skew (`useVelocitySkew`)
Display and Headline type shears with scroll momentum: max ±1.4° for section headings, ±1.6° for the hero, ±2° for the finale, mapped from smoothed scroll velocity and spring-returned to 0° at rest. Transform-only; collapses to 0° under reduced motion. Apply only to `KineticHeading` and the hero/finale headlines, never to body copy or images.

### Kinetic Heading (`KineticHeading`)
The standard section opener: one mask + slide-up per visual line (110% → 0, ease-out-expo 900ms, 90ms stagger) plus velocity skew. All section headings use it; ad-hoc heading animations are retired.

### Progress Paragraph (`ProgressParagraph`)
One per page, in About: words brighten from 18% to full opacity as the paragraph crosses the viewport, pacing the read. Reduced motion renders the plain paragraph.

### Preloader
A type-only veil tied to real readiness (font loading), never a fake timer: wordmark top-left, tabular counter bottom-right, a 2px Ember progress hairline as its one beacon. Minimum 1s on screen, hard cap 2.4s, 200ms hold at 100, then the veil slides up over 800ms ease-out-expo while the hero reveal begins underneath. Skipped entirely for reduced-motion users and repeat visits in-session. If it ever waits on nothing real, cut it.

### Contextual Cursor (`CustomCursor`)
A 10px near-white dot under `mix-blend-mode: difference`, spring-tracked with zero render cost. It grows 2.4× over links and buttons, and swaps to a 64px verb disk over surfaces that need one: "View" on project cards, "Drag" on the work rail (via `data-cursor` attributes). Mouse + fine pointer only; the native cursor is suppressed while it is mounted. This is a functional cursor, not a trail: no glow, no particles, no echo. One dot, one verb.

### The Footer Finale
The last viewport is the page's second Display moment: eyebrow, "Let's work together." at `clamp(3.25rem, 11.5vw, 9.5rem)`, supporting line, then the email CTA — the loudest Ember on the page — with a magnetic pull (`Magnetic`, strength 0.22, mouse-only). Below it, the living status line (availability dot in Ember Subtle, city, live local time) and the legal hairline row.

### Live Time
Amsterdam local time (HH:MM, tabular nums) rendered live in the hero eyebrow and the finale status line. A quiet proof the site is maintained, not a template.

### Case-Study Deep Links
Every case study is addressable at `/work/:slug`. Opening pushes history, prev/next swaps replace it, Back closes the overlay, and direct loads open it over the rail with no morph. The document title follows the open study.

## 6. Do's and Don'ts

### Do:
- **Do** use OKLCH values directly in CSS. Every neutral carries hue 50, chroma ≈0.008.
- **Do** reserve Ember for the primary CTA, the active nav underline, one emphasized word, and focus rings. Nothing else.
- **Do** ship dark and light as first-class peers. Test every new screen in both themes before committing.
- **Do** honor `prefers-reduced-motion`: motion is cut to ≤180ms fades, and hero slide-ups skip to their resting state.
- **Do** cap body line length at 52–65ch. Respect the measure.
- **Do** use sharp-edged primary buttons (`border-radius: 0`). This is a committed brand choice.
- **Do** use Framer Motion ease-out-expo (`[0.16, 1, 0.3, 1]`) for entrances. It's the system's signature curve.
- **Do** use `layoutId` for continuity (nav indicator, case-study morphs).
- **Do** extract only a component's distinctive CSS when building new components. No reset bloat.

### Don't:
- **Don't** use `#000` or `#fff`. Every neutral is tinted — hue 50 at low chroma.
- **Don't** use gradient text or `background-clip: text` for decoration. One solid color; emphasis via weight, size, or the Ember accent.
- **Don't** use glassmorphism as an aesthetic. The nav's backdrop-blur is the only sanctioned use in the whole system.
- **Don't** build identical project-card grids — icon + heading + text, repeated. Project cards vary; they are not clones.
- **Don't** build a hero-metric template (big number + small label + supporting stats). It's the SaaS cliché PRODUCT.md explicitly rejects.
- **Don't** add a testimonials carousel, a gradient mesh background, or a cursor trail. All are template-shaped.
- **Don't** use em dashes (`—` or `--`) in UI copy. Commas, colons, semicolons, parentheses, periods.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe. Side-stripe borders are banned.
- **Don't** round primary buttons. Radius 0 is the commitment.
- **Don't** UPPERCASE buttons, nav links, or body labels. Uppercase is reserved for the Eyebrow role.
- **Don't** animate CSS layout properties (width, height, top, left). Transform and opacity only.
- **Don't** ship two Display-scale elements in the same viewport. The page's two Display moments are the hero headline and the footer finale, a full page apart; nothing else reaches that scale.
- **Don't** retrofit light mode. Design each theme natively or the design fails.
