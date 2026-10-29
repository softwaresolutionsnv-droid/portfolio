---
target: "werkstukbeeld: merkplaten en details"
total_score: 16
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 3
target_identity: "file:/Users/nilsautodisk/Documents/nv/portfolio/src/components/CaseStudy.tsx"
target_fingerprint: "sha256:f588944809a1e8e1720ef38b12d78f11be7f6d01c0889121cac69c079e904e51"
target_path: /Users/nilsautodisk/Documents/nv/portfolio/src/components/CaseStudy.tsx
timestamp: 2026-10-29T15-47-52Z
slug: src-components-casestudy-tsx
---
Method: dual-agent (A: general-purpose/sonnet · B: general-purpose/sonnet)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Herkomst/status chips, viewport label per image |
| 2 | Match System / Real World | 2 | BRC caption promises PDF not in image; English "7-10 days" in Shaftlab |
| 3 | User Control and Freedom | 3 | Case page close/prev/next solid |
| 4 | Consistency and Standards | 2 | Plate grid: phone bleeds on 3 plates, stops short on NB and 4 Fruit |
| 5 | Error Prevention | n/a | No input on this surface |
| 6 | Recognition Rather Than Recall | 3 | Plate reads at a glance; details tiny in strip |
| 7 | Flexibility and Efficiency | n/a | Experience surface |
| 8 | Aesthetic and Minimalist Design | 3 | Strong plates; some details bare white or tightly cropped |
| 9 | Error Recovery | n/a | No error states |
| 10 | Help and Documentation | n/a | Portfolio |
| Total | | 16/24 | Acceptable (67%) |

## Design Specificity Verdict
Specific: every plate in the client's own colour, font, headline and logo. Weak spot: some details read as datasheet/empty card (Shaftlab specs, 4 Fruit BRC). Detector: 0 findings on Work.tsx/CaseStudy.tsx; browser overlay 18 page-wide findings outside target. Assessment A's claim that the mobile hero repeats as a detail is false (metBeelden filters merkplaat.bron).

## Priority Issues
- [P1] English leak "7-10 days" in shaftlab-plaat.jpg and shaftlab-stap.jpg (own product). Fix Shopify locale, recapture. /impeccable clarify
- [P1] Plate grid inconsistent: phone stops short with white band in nb-onderhoudsdiensten-plaat.jpg and 4fruit-plaat.jpg. Fix: .scherm fixed height past bottom edge, img object-fit cover top (scripts/merkplaat.mjs). /impeccable polish
- [P1] 4fruit-brc.jpg caption promises PDF that is not in the capture; 40% dead whitespace. Fix caption or capture with PDF visible; crop. /impeccable clarify
- [P2] Gallery sizes details by height, enlarging wide/short crops beyond true size (shaftlab-specs ~2x, puikbouw-werkwijze ~1.4x, 4fruit-brc, nb-verbouw-mobiel blurry); violates "op ware grootte". Cap at natural CSS width. /impeccable layout
- [P2] Crops without breathing room: text flush to edge in puikbouw-werkwijze.jpg, nb-verbouw-mobiel.jpg; shaftlab-stap.jpg cut right under product name. Add optional `marge` per uitsnede (clip on expanded bounding box). /impeccable polish

## Persona Red Flags
- Warm lead: English leak + missing PDF read as unfinished.
- Jordan: "( 1440 )" label on crops that are not 1440 wide.
- Sam: small line on olive/teal plates at ~4:1 (below AA small text); alt covers content.

## Minor Observations
- Typing caret "|" in sc-weekly-report-roas.png.
- nb-verbouw-mobiel: "Verbouw" card shows a pergola (client's own choice).
- puikbouw-projectkaart: play button competes with Voor/Na switch.
- shaftlab-specs carries little brand feel.
- Strip plate widths 128 vs 192 px follow intended compact sites rows.

## Questions to Consider
- One strong detail per werkstuk instead of two?
- Should one detail per werkstuk show a result (e.g. ROAS above target)?
- Keep "( 1440 )" or switch to "( desktop )"/"( mobiel )"?
