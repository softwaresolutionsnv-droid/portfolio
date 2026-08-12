---
name: Nils Vogelaar — Portfolio
description: Freelance designer-developer portfolio as a concrete monograph; charcoal and bone duotone with one oxide accent.
colors:
  oxide: "oklch(0.48 0.15 30)"
  oxide-deep: "oklch(0.42 0.15 30)"
  oxide-ink-dark: "oklch(0.62 0.16 32)"
  oxide-ink-light: "oklch(0.47 0.15 30)"
  emboss-night: "oklch(0.19 0.005 260)"
  emboss-day: "oklch(0.905 0.005 90)"
  night-bg: "oklch(0.14 0.004 260)"
  night-surface: "oklch(0.18 0.005 260)"
  night-elevated: "oklch(0.22 0.005 260)"
  night-text: "oklch(0.93 0.004 90)"
  night-text-secondary: "oklch(0.68 0.005 90)"
  night-text-muted: "oklch(0.55 0.005 90)"
  night-border: "oklch(0.28 0.005 260)"
  night-border-subtle: "oklch(0.22 0.004 260)"
  bone-bg: "oklch(0.96 0.004 90)"
  bone-surface: "oklch(0.92 0.005 90)"
  bone-elevated: "oklch(0.88 0.005 90)"
  bone-text: "oklch(0.18 0.005 260)"
  bone-text-secondary: "oklch(0.40 0.006 260)"
  bone-text-muted: "oklch(0.52 0.005 260)"
  bone-border: "oklch(0.80 0.005 90)"
  bone-border-subtle: "oklch(0.87 0.004 90)"
typography:
  monument:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.8vw, 7.5rem)"
    fontWeight: 500
    fontStretch: "125%"
    lineHeight: 0.92
    letterSpacing: "0.01em"
    textTransform: "uppercase"
  plate-numeral:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(5rem, 18vw, 16rem)"
    fontWeight: 200
    fontStretch: "125%"
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)"
    fontWeight: 500
    fontStretch: "125%"
    lineHeight: 1.05
    letterSpacing: "0.01em"
    textTransform: "uppercase"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    fontStretch: "125%"
    lineHeight: 1.05
    letterSpacing: "0.01em"
    textTransform: "uppercase"
  lede:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  serif-intro:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  essay:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  caption:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  caption-small:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
    textTransform: "uppercase"
  index:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
    fontVariantNumeric: "tabular-nums"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "96px"
  3xl: "160px"
components:
  button-primary:
    backgroundColor: "{colors.oxide}"
    textColor: "oklch(0.96 0.004 90)"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 36px"
  button-primary-hover:
    backgroundColor: "{colors.oxide-deep}"
    textColor: "oklch(0.96 0.004 90)"
    rounded: "{rounded.none}"
    padding: "18px 36px"
  button-hairline:
    backgroundColor: "transparent"
    textColor: "{colors.night-text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "17px 35px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.night-text-secondary}"
    typography: "{typography.index}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  spec-row:
    backgroundColor: "transparent"
    textColor: "{colors.night-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: "20px 0"
---

# Design System: Nils Vogelaar — Portfolio

## 1. Overview

**Creative North Star: "The Concrete Monograph"**

The portfolio is a high-end architectural monograph rendered as a website. No metaphor is performed and nothing is skeuomorphic: the page simply carries itself like a printed monograph of built work — vast scale contrast, duotone plates, hairline rules, engraved capitals, and shadow as the only ornament. Each project is a numbered plate. The visitor leafs; the work leads; the interface recedes.

This world replaces "The Signal Fire" (warm graphite + vermillion, kinetic type, preloader, custom cursor). Nothing from that vocabulary survives. The prior site's award-chrome (preloader, contextual cursor, velocity skew) is retired; the new system's spectacle is stillness, mass, and one photographic reveal.

**Key Characteristics:**
- Cool charcoal and bone duotone; color belongs to the work, not the chrome
- One accent, Oxide: deep rust used for the active plate numeral, the primary CTA, selection, and focus — never decoration
- Archivo Expanded capitals at monumental scale against small engraved labels; Source Serif 4 for essay text
- Radius 0 everywhere; hairline rules structure the page; no cards, no pills, no shadows-as-style
- Plates rest in duotone and develop into full color when attended — the system's signature move
- Museum-slow motion: long ease-outs, small distances, nothing bounces

Both themes are first-class, as product law. Dark ("Night Gallery", default) is charcoal walls with lit plates. Light ("Printed Page") is bone paper with charcoal ink. Each is the same monograph under different light.

## 2. Colors

### Accent
- **Oxide** (`oklch(0.48 0.15 30)`): the only chroma the chrome may carry, as the primary CTA fill (0.48 keeps bone label text at AA). Reserved for the primary CTA surface, the active plate numeral, selection, and focus rings.
- **Oxide Deep** (`oklch(0.42 0.15 30)`): primary CTA hover. Never decorative.
- **Oxide Ink** (`--accent-ink`): Oxide as body-sized text — `oklch(0.62 0.16 32)` on Night, `oklch(0.47 0.15 30)` on Day, both AA.
- **Emboss** (`--emboss`): the blind-emboss tone for the colossal hero numeral and typographic fallback plates; barely off the ground in each theme.

### Neutral — Night Gallery (dark, default)
- **Night BG** (`oklch(0.14 0.004 260)`): page canvas; cool charcoal, never pure black.
- **Night Surface** (`oklch(0.18 0.005 260)`) / **Night Elevated** (`oklch(0.22 0.005 260)`): tonal steps for overlays and the case-study spread.
- **Night Text** (`oklch(0.93 0.004 90)`): bone-white ink.
- **Night Text Secondary** (`oklch(0.68 0.005 90)`), **Muted** (`oklch(0.55 0.005 90)`).
- **Night Border** (`oklch(0.28 0.005 260)`) / **Subtle** (`oklch(0.22 0.004 260)`): hairlines.

### Neutral — Printed Page (light)
- **Bone BG** (`oklch(0.96 0.004 90)`): barely-warm paper, not cream.
- **Bone Surface / Elevated**: tonal steps.
- **Bone Text** (`oklch(0.18 0.005 260)`): charcoal ink.
- **Bone Text Secondary / Muted**, **Bone Border / Subtle**: as listed in frontmatter.

### Named Rules

**The Ink Rule.** Chrome is duotone: charcoal and bone only, plus Oxide in its four reserved roles. Full color enters the page exclusively through project imagery.

**The One Oxide Rule.** At rest, at most one Oxide surface per viewport. Its rarity is its authority.

**The Cool Ground Rule.** Neutrals are cool (hue 260, chroma ≤ 0.006) on the dark ground and barely-warm bone (hue 90, chroma ≤ 0.005) on light. No pure `#000`/`#fff`; no warm cream.

## 3. Typography

**Display:** Archivo (variable; width 125 "Expanded", weights 200–600). Monumental settings are uppercase, positive-tracked, engraved in the page.
**Text:** Source Serif 4 (variable) for essays and captions — the monograph's book hand.

### Hierarchy
- **Monument** (500, expanded, `clamp(2.75rem, 6.8vw, 7.5rem)`, lh 0.92, uppercase): the title page name and the colophon close. Exactly two per page, a full page apart, both at this one scale so neither outranks the other.
- **Plate Numeral** (200, expanded, number-only): the project index number, scaled to context — `clamp(5rem, 13vw, 12rem)` on plates, up to `clamp(20rem, 55vh, 44rem)` as the hero's blind emboss (weight 100, `--emboss` tone).
- **Headline** (500, expanded, uppercase): project titles and the case-study title.
- **Title** (headline voice at 1.125rem): spec-table tool names.
- **Lede** (serif, `clamp(1.375rem, 2.4vw, 1.75rem)`): the essay intro and case-study opening paragraph.
- **Serif Intro** (serif, `clamp(1.0625rem, 1.4vw, 1.25rem)`): hero practice line, colophon supporting line.
- **Essay** (serif, 1.1875rem, lh 1.75): long-form paragraphs, measure capped at 62ch.
- **Caption** (serif, 1rem) / **Caption Small** (serif, 0.9375rem): plate captions, spec values, index annotations.
- **Label** (Archivo 500, 0.8125rem, tracking 0.14em, uppercase): eyebrows, buttons, table headers.
- **Index** (Archivo 400, 0.8125rem, tabular): nav items, plate numbers in margins, metadata.

### Named Rules

**The Two Monuments Rule.** The title page name and the colophon close are the page's only Monument settings; nothing between them approaches that scale except Plate Numerals, which are number-only.

**The Measure Rule.** Serif text caps at 62ch. Never full-width prose.

**The Engraved Caps Rule.** Uppercase always carries positive tracking (≥ 0.01em at monument scale, 0.14em at label scale) and lives only in the Monument, Headline, and Label roles. Tight-tracked uppercase is banned.

## 4. Elevation & Light

Flat, tonal, and lit — never floating. Depth comes from the tonal stack and from light behaving like light on matte concrete.

- **The Raking Light**: the one gradient in the system. A near-invisible luminance sweep (≤ 4% lightness delta) may cross a Monument setting once on entrance, like sun crossing an incised wall. Never on body text, never looping.
- **The Develop**: plates rest in duotone (grayscale, lifted slightly toward the theme's ground) and develop to full color when attended. Scroll position is the developer bath: where scroll-driven animations are supported (`animation-timeline: view()`), development is continuous and bidirectional — the print emerges on approach, completes just before viewport center, and recedes as it leaves; the plate numeral inks to Oxide only in the final stretch of development (a threshold, never a mid-blend). Hover/focus develops the plate fully via a separate ~1200ms-eased attention value merged with `max()`. Browsers without scroll timelines get the one-shot in-view develop (~1200ms ease) as a complete experience; reduced motion shows full color immediately.
- **Case-study spread**: sits on Elevated tone with a 1px border. No backdrop blur anywhere. No decorative drop shadows; the single functional shadow allowed is under the open case-study spread (`0 40px 120px -40px oklch(0 0 0 / 0.5)`).

## 5. Components

### Buttons
- **Primary ("the seal")**: Oxide fill, bone text, Label type, `18px 36px`, radius 0. One per page region at most; the colophon's is the largest.
- **Hairline**: transparent, 1px border in the theme border color, Label type. Hover fills with Surface tone. Used for secondary actions.
- **Text-action**: Index type with a hairline underline offset 6px; hover shifts the underline to text color. External links append "↗" as a typeset character, not an icon.
- **Focus**: 2px Oxide outline, offset 3px, keyboard only.

### Navigation
- A single hairline header: wordmark ("N.VOGELAAR", Label type) left; plate index ("01 02 03", Index type) center; theme toggle and colophon link right. Transparent at rest; after 40px scroll it gains the theme BG at 95% opacity and a bottom hairline. No blur.
- The active plate number in the nav renders in Oxide; it is that viewport's one Oxide when no CTA is visible.
- Theme toggle is text: "Day" / "Night" (Index type), not an icon pair.

### Plates (project pattern)
- Full-width compositions on the page grid, separated by hairlines and 160px of air, never boxed.
- Anatomy: Plate Numeral overlapping the image edge; Headline title; serif lede; spec captions (role, year, client, stack) in a hairline-ruled caption grid; image in duotone-at-rest.
- Images keep native aspect ratios. Hover lifts nothing: the Develop plays and the plate's number turns Oxide.
- Plates alternate composition (numeral left / numeral right); they are never identical tiles.

### Spec tables (skills, case-study highlights)
- Hairline-ruled rows, Label header column, Caption values. No chips, no pills, no tags. Stack lists render as comma-separated serif text.

### Section rules
- 1px static hairlines in the theme border color. The old animated `scaleX` sweep is retired.

## 6. Motion

**Grammar: mass, not energy.** Everything moves as if it weighs something.

- Entrances: opacity + ≤ 24px translate, 900–1200ms, ease `[0.22, 1, 0.36, 1]`. Staggers ≥ 120ms.
- The Develop and the Raking Light are the only two signature effects. No springs, no bounces, no velocity-coupled transforms, no parallax.
- Case-study transitions: a slow vertical spread-open (transform/opacity only).
- `prefers-reduced-motion`: entrances become ≤ 180ms fades; Develop and Raking Light are disabled (plates rest in color).

## 7. Do's and Don'ts

### Do:
- **Do** let project imagery be the only full-color element on the page.
- **Do** compose with scale contrast: monumental numerals against small engraved labels.
- **Do** keep radius 0 on every element. No exceptions.
- **Do** use 1px hairlines in the theme border color as the page's structural drawing.
- **Do** ship Night and Day as equals; test every change in both.
- **Do** keep serif measure ≤ 62ch and label tracking at 0.14em.

### Don't:
- **Don't** reintroduce the retired vocabulary: preloader, custom cursor, velocity skew, animated hairline sweeps, magnetic buttons, background orbs, grain overlays.
- **Don't** use blur anywhere, including the nav.
- **Don't** use pills, chips, cards, or any rounded container.
- **Don't** use gradient text, glassmorphism, or decorative shadows.
- **Don't** give chrome any chroma beyond Oxide's four reserved roles.
- **Don't** animate layout properties; transform and opacity only.
- **Don't** exceed two Monument settings per page.
- **Don't** use icon fonts or Lucide glyphs on the public site; arrows and marks are typeset characters.
