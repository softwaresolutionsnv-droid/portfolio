---
target: hero
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/nilsautodisk/Documents/nv/portfolio/src/components/Hero.tsx"
target_fingerprint: "sha256:d24b83954ce362fe482ecf906382e792483c3abaa84c3647af5e913ba261b4e2"
target_path: /Users/nilsautodisk/Documents/nv/portfolio/src/components/Hero.tsx
timestamp: 2026-10-06T20-16-37Z
slug: src-components-hero-tsx
---
Method: dual-agent (A: design review, sonnet; B: detector + browser, sonnet)

# Critique: hero (src/components/Hero.tsx + src/components/Dither.tsx)

Mode: Experience/Persuade. The hero was critiqued as it ships now. The planned point-cloud portrait will replace the material, so each issue is tagged [material] (goes away with the video dither) or [composition] (survives the swap).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | The live clock and the tagline decode show the page is alive. There is no scroll cue. |
| 2 | Match System / Real World | 3 | The copy is concrete. Only the nav tagline "Eerste indruk" talks about the site, not about Nils. |
| 3 | User Control and Freedom | 2 | The 13s video loop has no pause control on the page (WCAG 2.2.2). Reduced motion only works through the OS setting. |
| 4 | Consistency and Standards | 3 | The bracket/mono grammar is consistent throughout. |
| 5 | Error Prevention | 3 | There is nothing to break. The mailto links have a pre-filled subject. |
| 6 | Recognition Rather Than Recall | 2 | On mobile, contact is only reachable through burger, then menu. "DIT BEN IK ( + )" does not say what it opens. |
| 7 | Flexibility and Efficiency | n/a | Persuade surface, not a task tool. |
| 8 | Aesthetic and Minimalist Design | 3 | The chrome is restrained, but the field competes with the headline because it reads as noise. |
| 9 | Error Recovery | n/a | The hero has no error states. |
| 10 | Help and Documentation | n/a | Does not apply to a landing viewport. |
| **Total** | | **19/28** | **Acceptable (68%, just under Good)** |

## Design Specificity Verdict

**LLM assessment:** the lamalama grammar is carried over almost 1:1: caps at lh .82, mono in brackets, the pill nav with its tagline, the card stack, the dither field and the meta bar. That is faithful to the brief, but it leaves only two places for character of its own: the copy and the face.

- The copy works. "Eén persoon van eerste gesprek tot livegang" with "geen overdrachten, geen accountmanagers" is a positioning a prospect can check.
- The face does not. hero.jpg is a clean profile, but after 5-level glyph quantization the skin and the fog land on the same levels. The hair becomes a black mass that looks like a continent, and the head reads as terrain. At 390px only a fragment of the cheek is left.

Net result: the first viewport reads as "lamalama, in Nils's words". It does not yet read as Nils.

**Deterministic scan:**
- CLI impeccable detect on Hero, Dither, Nav and BottomBar: 0 findings, exit 0.
- Live-DOM overlay: 14 findings across the whole page, almost all false positives or outside the hero.
  - 8x low-contrast "1.0:1": the detector reads the transparent .btn background as the text colour.
  - 3x tight-leading on script/style elements.
  - all-caps-body on an sr-only span.
  - overused-font Geist: this is a DESIGN.md choice.
  - pulsing-dot: a deliberate status signal.
  - Real but outside the hero: the copyright line is 10px, below the 11px floor.
- What the detector misses: contrast of text over the WebGL canvas. It reads CSS colours, not canvas pixels. Every hero problem sits at the judgement level.

## Overall Impression

The type, copy and chrome are well crafted. The material undermines the promise: the headline says "one person", and the image shows no person. Biggest opportunity: make head legibility and a text-safe zone acceptance criteria for the point cloud, and give the headline the scale that "Bold" promises.

## What's Working

- **Copy as positioning.** The headline and the practice line together give a real difference from competitors who say "I craft digital experiences". This survives any material swap.
- **Chrome craft.** Several details show care a prospect would want to buy:
  - the tagline decode on every section change
  - the menu that opens inside the pill, with the language switch first
  - the bottom bar that wipes away on scroll and types back in
  - the live Amsterdam clock
- **Performance and degradation.**
  - The canvas is 2245x1242 at dpr 2, so the 1.5 dpr cap holds.
  - The video is 295KB and the poster 9KB. The h1 is in the DOM at ~195ms, with no CLS.
  - Reduced motion degrades cleanly.

## Priority Issues

**[P1] The person does not read: figure-ground collapses** [material, input for the point cloud]
- **Why:** the headline promises a person, and an earlier stand-in figure already cost trust. A face that reads as a map is the first thing a prospect sees.
- **Fix now:** add a tone curve before quantization in the cell pass (Dither.tsx:51-60), for example a smoothstep on luminance, so skin lands on levels 4-5 and fog on 1-2.
- **Fix for the point cloud:** make "head recognisable at 390 and 1440 at a glance" an explicit criterion in the still-preview gate.
- **Command:** /impeccable polish

**[P1] Text contrast over the field fails on mobile and for the eyebrow** [composition]
- **Why:** the scrim (Hero.tsx:19-23, h-[48%]) no longer covers the text block once the headline breaks into four lines at 390px. Estimates from pixel sampling (±0.5):
  - mobile headline ~2.7:1, needs 3:1
  - paragraph ~2.5:1, needs 4.5:1 (20px counts as normal text)
  - [ NILS VOGELAAR ] at 11px ~3.0:1 at every width, needs 4.5:1

  WCAG AA is a hard requirement in PRODUCT.md.
- **Fix:** tie the text-safe zone to the text block instead of a fixed 48%. Either use a taller scrim below sm, or add a shader uniform that dims the field below a y threshold. The second rule also applies to the point-cloud dots.
- **Command:** /impeccable adapt

**[P2] Display hierarchy is inverted: the hero headline is smaller than section titles** [composition]
- **Why:** .t-display is 68.5px at 1440px, while .t-display-sm (Services, case title) is 72px there. The page's first promise is set smaller than a section heading. The cause is the clamp in index.css:146, sized so that "VAN EERSTE GESPREK" fits in col-span-8 beside the paragraph. "Bold" is borrowed, not earned.
- **Fix:** at lg, move the practice line below the headline (or into a narrow top-right slot). Let the h1 span 12 columns and scale it to ~100-115px at 1440px. Test the EN lines separately, because the rag differs.
- **Command:** /impeccable typeset

**[P2] No contact route in the hero on mobile** [composition]
- **Why:** the side stack with CONTACT only shows from lg up. On a phone, contact is only reachable through burger, then menu, then CTA, while "Reach out" is success measure #1. On desktop the CONTACT card is the lamalama answer and it works.
- **Fix:** below lg, add an outline [ Plan een gesprek ↗ ] button under the practice line, using the same mailto as in Nav.tsx. No solid button on desktop, because that breaks the grammar.
- **Command:** /impeccable adapt

**[P2] Moving field without a pause control** [material, also applies to point-cloud idle breathing]
- **Why:** autoplay longer than 5s next to content, with no pause mechanism, is a WCAG 2.2.2 gap. Reduced motion only covers the OS setting.
- **Fix:** add a [ ❚❚ ] / [ ▶ ] toggle in the BottomBar, in mono grammar, that stops both the video and the render loop.
- **Command:** /impeccable harden

## Persona Red Flags

- **Founder comparing three freelancers between calls (project persona):**
  - Gets "one person, end to end" within 5s. Then the eye looks for the face and finds terrain.
  - The only proof that a real person is behind the site, availability, is hidden in the "DIT BEN IK" fold-out.
- **Casey (mobile, 390):**
  - The headline and eyebrow sit on bright glyphs, so contrast is low.
  - There is no CONTACT card.
  - The BottomBar wraps to two rows. NL/EN sits alone on row 2, with ~9px of space between the paragraph and the hairline.
- **Jordan (first visit):**
  - Sees no person.
  - "DIT BEN IK ( + )" and "VOLG MIJ" do not say what they do.
  - There is no clear next step except scrolling, and there is no scroll cue.
- **Riley (stress tester):**
  - Not tested: a short viewport under ~600px tall, where pt-32 pb-24 plus the bar could crowd.
  - Not tested: the fallback without WebGL. The poster exists, but that path was not checked.

## Minor Observations

- The nav tagline "Eerste indruk" is the only tagline about the site. "Werk dat draait" and "Wat ik doe" are about the content. Candidate: use the availability state from availability.ts as the hero tagline. That is proof instead of a claim, and it brings the status out of the fold-out.
- "VOLG MIJ" (BottomBar.tsx:158, opacity 0.6) is a label for two links and adds little. Its contrast is fine (~6.5:1).
- The hero is almost entirely monochrome. The only red is the N-mark's third bar and the clock dot. That follows the One Signal Rule, so no fix.

## Questions to Consider

- If the headline is the product, why does texture get 90% of the viewport and the promise only 68px?
- Should the stipple head be recognisable at a glance, or is "terrain that becomes a face on hover or scroll" the real idea? The second only works if it actually resolves.
- Would the hero still say "Nils" if you removed the eyebrow and the clock?
