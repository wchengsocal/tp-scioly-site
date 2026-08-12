# DESIGN.md — Torrey Pines Science Olympiad

Recorded from the built world. Ground truth, not intention.

## Files

| File | What's in it |
|---|---|
| `index.html` | Markup only. Direction contract in the opening comment, then nav, hero, falcon runway, season strip, roster, calendar, how-it-works, FAQ, close, footer. |
| `styles.css` | All styling. Opens with the palette derivation comment, then tokens, materials, components, sections, reveals, focus, reduced-motion. |
| `main.js` | All behaviour. One IIFE, no globals, loaded with `defer`. Header comment lists its thirteen numbered sections. |
| `Torrey-Pines-High-School-Logo.png` | The official athletics mark, 448×248 RGBA. |

No build step. Open `index.html` directly, or serve the folder over HTTP.

## World: Varsity Chenille

The page is built like a letterman jacket. Science Olympiad medals are varsity
awards that never get varsity treatment; this surface gives the team that
treatment. It deliberately refuses the category default — the dark-navy
"science site" with a particle canvas and a cyan accent.

## Color

Committed strategy: one red carries roughly half the surface against a warm
dark neutral. Every value is derived from melton-wool jacket materials.

| Token | Hex | Role |
|---|---|---|
| `--wool-deep` | `#6E120E` | dark melton, jacket in shadow; section gradient ends |
| `--wool` | `#8E1B14` | jacket body — the primary field (hero, season, close) |
| `--ember` | `#C4442A` | chenille letter face; hover accents, list bullets |
| `--bullion` | `#E0A33C` | gold bullion thread — primary CTA, numerals, focus ring |
| `--bone` | `#F2E6D4` | chain-stitch thread — primary text on all grounds |
| `--leather` | `#241512` | sleeve leather — roster/tracks/footer ground |
| `--bone-dim` | `#C8B49A` | secondary text on leather |
| `--wool-tint` | `#E5C4B8` | secondary text on wool (tinted from the hue, never gray) |

Secondary text is always tinted from its ground's hue. No grays anywhere.

## Type

Five sans faces, pinned by the user. They only hold together because each
one owns a single job and the roles never overlap.

| Token | Face | Role |
|---|---|---|
| `--display` | Manrope 700/800 | Headlines. Uppercase, `-.022em`. |
| `--body` | Inter 400/500 | Running prose. `line-height 1.58`, `-.006em`. |
| `--ui` | DM Sans 500/700 | Labels, nav, buttons, eyebrows. Wide-tracked caps. |
| `--data` | Roboto 500/700 | Dates, counters, figures. `tabular-nums` throughout. |
| `--accent` | Poppins 600/700 | The falcon section and the close, only. |

`--mono` is kept as an alias of `--ui` so the many existing label rules keep
working without a sweep; nothing on the page is actually monospaced now.

Inter and DM Sans are named bans in CLAUDE.md and Poppins/Inter appear on the
impeccable default-face list. The user pinned all five explicitly, which
overrides both. The mechanical detector still flags Inter on every run — that
finding is known and accepted, not unresolved.

## Materials

These are rendered, not simulated with filters:

- **`.felt`** — layered repeating-linear-gradients at 38°/-52°/90° producing a
  visible woven melton grain on every wool field.
- **`.hide`** — creased sleeve-leather grain: two soft radial light falls plus
  three off-axis crease gradients, on leather-ground sections.
- **Chain stitch** — dashed 1–1.5px strokes inset from an element's edge
  (`.stitched`, `.label-btn::after`, patch inner outlines).
- **Knit hem** — ribbed vertical banding with two bullion dash bands, closing
  the hero fold.
- **Chenille patch** — authored SVG: shield silhouette, bullion merrow edge,
  tufting pattern, season bar, with the school logo embroidered at its centre.

## The school mark

`Torrey-Pines-High-School-Logo.png` (448×248, RGBA) is the official Torrey Pines
Falcons athletics logo, used as a real asset in three places: the nav wordmark,
the hero crest patch, and the scroll-driven flight. It is never traced,
redrawn, recolored, or approximated — the file itself is the mark. Its cardinal
and gold are the source of the page's `--wool` and `--bullion`, which is why the
mark sits in this palette without adjustment.

## Components

- **`.label-btn`** — sewn clothing label. Offset + blurred shadow (never a
  zero-blur block shadow), inset dashed stitch that widens on hover, lifts 3px.
  `.ghost` variant for secondary actions. Min height 48px.
- **`.disc-row`** — full-width accordion row; display-scale name, mono metadata,
  circular chevron that fills bullion when open. Hover translates 12px on X.
- **`.track`** — the two audience panels. One wool-filled (students, primary),
  one outlined (sponsors). Pointer-follow warm light on fine pointers only.
- **`.legs`** — season schedule with a bullion thread that draws down on scroll
  and diamond nodes at each leg.

## Motion

One orchestrated moment plus restrained scroll response. Every effect fires
once and then holds still — nothing loops in peripheral vision.

- **Falcon flight** (the signature moment, and the first thing on the page):
  the hero *is* the runway. `.hero` is 260vh tall and `.hero-stage` is
  `position: sticky`, so the crest, headline and actions hold still while
  scroll position 0..1 scrubs the school logo across the canvas behind them —
  the Apple product-page mechanic. The mark banks along its arc, pulses ±3.5%
  on a 3.5-cycle beat so it reads as flying rather than sliding, carries a soft
  drop shadow, and stitches a dashed gold thread tracing the path already
  flown. The arc is tuned per breakpoint: a tall sweep on desktop, flattened
  into the top band on phones where the copy fills the middle. Repainted inside
  `requestAnimationFrame`, DPR-capped at 2. Under reduced motion the hero
  collapses to one ordinary viewport and a single still frame renders.
- **Patch stitch-on** (page load): felt backing → merrow edge → chenille letter
  drops in → arced lettering → season bar. Staggered 80ms–1000ms.
- **Patch settle** (hero scroll): the crest drifts down, scales to 0.93, and
  fades to 45% as you leave the hero. `rAF`-throttled, ≥700px only.
- **Heading word wipe**: `.h2` words are split and rise out of their own line
  box with a 2° rotation, staggered 55ms, once per heading on intersection.
- **Season strip**: each calendar stop lifts in sequence (70ms stagger) on
  entry, then stops. Static and scannable, never auto-scrolling.
- **Scroll progress**: a 3px ember→bullion thread across the top, `scaleX`.
- **Scroll reveals**: 26px rise + fade, staggered by `data-d` 1–3. Armed only
  behind a `.js` class on `<html>` — with JS off the page renders fully visible.
- **Season thread** and **counters** fire once on intersection. Counters support
  a `data-prefix` for values like "3–4" and "Top 20".
- **FAQ disclosure**: native `<details>`; body fades and slides 8px on open.
- Never `linear`. Accordion height animates via `grid-template-rows`.
- `prefers-reduced-motion` fully honored: all of the above become static.

## Responsive

Fluid by default: `clamp()` type scale, `--gutter: clamp(20px, 5vw, 72px)`,
auto-fit/auto-fill grids. Verified with no horizontal scroll at 320, 375, 768,
1024, and 1440. Nav links collapse below 900px; wordmark and CTA step down at
560px and 380px. Touch targets ≥ 48px. Pointer-follow effects are gated behind
`(hover:hover) and (pointer:fine)`.

## Accessibility

- Skip link; single `<main>`; semantic landmarks.
- Accordions are real `<button>`s with `aria-expanded` / `aria-controls`.
- Focus ring: 3px bullion, offset 3px; switches to bone on bullion-adjacent
  grounds.
- Icons are drawn SVG in one stroke weight — no emoji, no Unicode glyph icons.

## Standing conventions

Refused throughout, and should stay refused: purple/violet/indigo, gradient
headline text, pill badges above headings, kickers/eyebrows, three-stat rows,
same-size icon+title+text card grids, glassmorphism as decoration, emoji icons,
and hard zero-blur offset shadows.

## Content sourcing

All facts on the page come from tpscienceolympiad.wixsite.com/scioly (read
Aug 2026) and are recorded in PRODUCT.md. The site publishes no medal counts,
placements, officer names, or sponsor program — so the page claims none. Where
the source is silent, the page says so ("the full list goes out when teams are
released") rather than inventing filler.

## Open

- Season section still uses a dotted timeline rather than the jacket's own
  award-stripe vocabulary. Identity-depth opportunity, not a defect.
- Application form URL, full event rosters, and the state tournament date are
  marked TODO in the markup; they post when the club opens applications.
