---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/Hero.tsx","src/components/Projects.tsx","src/components/CaseStudy.tsx","src/components/Contact.tsx"]
---

# Surface brief: portfolio one-pager (public site)

**Scope:** the full public one-page site (Hero/index, plates, essay, specifications, colophon) plus the case-study spread at /work/:slug.
**Visitor mode:** Experience. The work leads; the interface recedes.

**Audience & job:** founders, businesses, and product teams evaluating whether to hire Nils; they must assess capability within seconds. Success = reach out (email CTA) or remember.

**Action:** email CTA in the colophon is the page's one primary action. Availability state (available / limited / unavailable, from CMS) renders in the colophon as a plain sentence.

**Proof/content:** three real projects from src/data/content.json (BerijdersApp, FleetDisk, N.B. Onderhoudsdiensten) with real images in /public/projects. Copy may be tightened but claims stay factual; no invented metrics.

**Chosen direction:** The Concrete Monograph (see DESIGN.md), composition "Marginal Index" (approved comp: hero = index-of-built-work column left, stacked monumental name right, colossal blind-embossed numeral behind). The index rows anchor-link to their plates.

**Memorable moment:** the Develop — plates rest in duotone and develop to full color when attended; plus the blind-emboss numeral behind the title page name.

**Constraints:** CMS content schema untouched; case-study deep links (/work/:slug, history behavior, document title) preserved; both themes first-class; WCAG 2.2 AA; reduced-motion complete.

**Unresolved:** whether the old animated-chrome components (Preloader, CustomCursor, KineticHeading, Magnetic, AnimatedBackground, SmoothScroll, ProgressParagraph, LocalTime) are deleted from the repo or left unreferenced. Build deletes their usage; files removed.
