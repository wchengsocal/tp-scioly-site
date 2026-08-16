# DESIGN.md — Torrey Pines Science Olympiad

Recorded from the built world. Ground truth, not intention.

## Files

| File | What's in it |
|---|---|
| `index.html` | Markup only. Direction contract in the opening comment, then nav, hero, falcon runway, season strip, roster, gallery, calendar, how-it-works, close, footer. |
| `about.html` | The officers page. Wool header, leather roster of five, wool close. |
| `faq.html` | The six questions, moved off the homepage. Same three-band structure as `about.html`. Surface mode is **Read**, not Persuade: the questions are grouped "Before you apply" / "Once you're on a team" and reordered so the answer that decides the most minds — no experience needed — leads. |
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
| `--bullion-ink` | `#F5CE86` | bullion lifted for small text on wool; base bullion is 4.09:1 there and fails AA |
| `--wool-tint` | `#E5C4B8` | secondary text on wool (tinted from the hue, never gray) |

Secondary text is always tinted from its ground's hue. No grays anywhere.

## Type

One serif against three sans faces. They hold together because each owns a
single job and the roles never overlap.

| Token | Face | Role |
|---|---|---|
| `--display` | Libre Baskerville 700 | Headlines. Mixed case, `-.012em` to `-.028em`. |
| `--body` | Inter 400/500 | Running prose. `line-height 1.58`, `-.006em`. |
| `--ui` | DM Sans 500/700 | Labels, nav, buttons, patch lettering. Wide-tracked caps. |
| `--data` | Roboto 500/700 | Dates, counters, figures. `tabular-nums` throughout. |

Baskerville is the classic diploma and certificate face, which is the note the
headlines are meant to strike. Libre Baskerville is its screen cut: sturdy
bowls, high x-height, and exactly the 400/700 range this page uses. Georgia
holds the fallback slot because the two are metrically close, so a slow swap
changes shapes rather than reflowing the page. Georgia previously held the
display role outright — a system face as the display voice of an own-world
page, rendering as Times New Roman wherever Georgia is absent.

`--mono` is kept as an alias of `--ui` so the many existing label rules keep
working without a sweep; nothing on the page is monospaced. The chenille
patch lettering is `--ui` as well; it previously named Sometype Mono, which
was never loaded, so the crest rendered in Courier New.

Poppins was removed. It was a full font request used on exactly one element
(`.close .h2`), which made the page's most important heading the one place the
display face changed. That heading now uses `--display` and is marked as the
climax by size alone, being the largest on the page.

Inter and DM Sans are named bans in CLAUDE.md, and Inter appears on the
impeccable default-face list. The user pinned them explicitly, which overrides
both. The mechanical detector still flags Inter on every run — that finding is
known and accepted, not unresolved.

### Scale

Sizes are named for their job, not their value. Before these tokens existed
the label role alone was set at `.68/.70/.72/.73/.74/.75rem` across seventeen
selectors, and prose at `.88/.95/.96/.98/.99/1rem` across eight — spreads of
about 1px that read as accumulated drift rather than hierarchy.

| Token | Value | Role |
|---|---|---|
| `--fs-label-sm` | `.70rem` | Quietest metadata: captions, footer, track kind. |
| `--fs-label` | `.74rem` | The standard wide-tracked cap label. |
| `--fs-btn` | `.80rem` | Sewn-label buttons. |
| `--fs-note` | `.88rem` | Skip link, privacy notice. |
| `--fs-prose-sm` | `.96rem` | Dense supporting prose in cards and steps. |
| `--fs-prose` | `1rem` | Running prose inside sections. |

Display sizes stay per-section `clamp()` values: the hero, the section `.h2`,
and the closing call are deliberately different scales, not one role drifting.

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
  The same stops are duplicated in the `stops` array in `main.js` for the
  marquee. There is no shared source, so the two must be edited together.
- **`.shot`** — a gallery figure held the way the jacket holds a patch: 2px
  bullion merrow edge, dashed chain stitch inset 7px, felt gradient behind,
  offset-and-blurred shadow. The figure owns the frame and the aspect-ratio,
  so `.plate` (the placeholder) and `.shot-img` (a real photograph) get the
  identical treatment and swapping one for the other changes nothing else.
  Spans are authored per breakpoint — heavy-left, then heavy-right, then a
  24:9 closing band — because an auto-fit grid of equal tiles is the one
  structure the rest of this page refuses. Ratios stay wide (16:9, 4:5, 24:9)
  so the section reads as a band inside a long page rather than out-weighing
  the events list above it. The frames carry no `height`: the aspect-ratio
  sets it, because a height against a stretched grid item made the plate fill
  the whole row and swallow its own caption.

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
  The split pass strips `rv` from the heading, so the word wipe is that
  heading's only entrance — a block that fades and rises while its own words
  fade and rise reads as mush rather than one gesture.
- **Season strip**: each calendar stop lifts in sequence (70ms stagger) on
  entry, then stops. Static and scannable, never auto-scrolling.
- **Scroll progress**: a 3px ember→bullion thread across the top, `scaleX`.
- **Scroll reveals**: 26px rise + fade, staggered by `data-d` 1–3. Armed only
  behind a `.js` class on `<html>`, set by an inline `<head>` script so the
  JS-only states apply before first paint instead of flashing open and then
  collapsing. With JS off the class never lands: reveals render visible, the
  event accordions render open, and the JS-built season strip is hidden
  rather than showing as an empty bordered bar.
- **Gallery patches sewn down**: each `.shot` enters in three beats — the frame
  clips open (780ms), the basting stitch pulls tight from 18px to its final
  7px inset (550ms, +260ms), then the caption settles (450ms, +400ms). The
  wipe direction follows the layout: paired figures in a row open toward each
  other, and the full-width closing band opens from its centre outward. It
  deliberately does not reuse the crest's fade-and-scale mechanism — the hero
  keeps sole ownership of that. Runs on the existing `.rv` observer, so each
  figure fires on its own and the closing band never animates below the fold.
  No new observer and no new script.
- **Keep-scrolling cue**: a bullion chain stitch above the knit hem, shown only
  at scroll position 0 and removed permanently on the first scroll. It exists
  because the runway holds the copy still for 1.6 viewports, which without a
  signal reads as a stuck page. Three plays maximum, then gone; hidden under
  600px of viewport height so it cannot collide with the copy.
- **Season thread** and **counters** fire once on intersection. Counters split
  by kind: plain cardinals (15, 4) count up, because every intermediate value
  is a smaller true number. Prefixed values (`data-prefix` "3–", "Top ") never
  count — a range and a threshold ticked through render "3–1" and "Top 7",
  which are false statements rather than smaller numbers. Those arrive whole
  on a 520ms stitch-in.
- **FAQ disclosure**: native `<details>`; body fades and slides 8px on open.
- Never `linear`. Accordion height animates via `grid-template-rows`.
- `prefers-reduced-motion` fully honored: all of the above become static.

## Anchor scrolling

In-page links glide rather than jump, but CSS `scroll-behavior:smooth` is
deliberately not used: native smooth scroll has no duration control, so with a
tall sticky runway in the page a hero-to-FAQ jump crawls through all of it.
`main.js` animates instead, on a duration capped at 420–900ms, so a
five-screen jump feels much like a one-screen jump. Easing is easeOutQuint,
the same fast-out long-settle shape as `--ease`.

Three things the glide does beyond moving the page: it offsets the landing so
the target clears the fixed bar instead of sitting under it, it moves focus to
the landed section so keyboard and screen-reader users actually arrive where
the link promised, and it aborts on the first wheel, touch, or key press,
because a page that fights the reader's own scroll is worse than one that
jumps. Under reduced motion it is an instant jump with the same offset and the
same focus move. `scroll-margin-top` covers arriving on a hash URL directly,
where the browser scrolls and no script is involved.

## Navigation

The bar is a three-column grid (`1fr auto 1fr`) with columns pinned explicitly,
so the link row sits on the true page centre rather than on the midpoint
between a wide wordmark and a narrow button.

Below 900px the links become a real disclosure panel: a labelled toggle with
`aria-expanded` / `aria-controls`, height animated via `grid-template-rows`
(the same mechanism as the event accordion, never `max-height`), closed with
`visibility:hidden` so the links leave the tab order rather than staying
focusable inside a collapsed box, Escape to close, close on navigate, and
release on resize. With JS off the panel is never collapsed at all: the links
wrap onto a second row. Nothing is ever hidden behind a control that cannot
open. They were previously `display:none` with no replacement, which made
About, the calendar, and the FAQ unreachable on a phone.

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
- The gallery ships five `.plate` placeholders, not photographs. Every one is
  marked TODO, and the captions describe what each frame should show rather
  than claiming a result. Until real photos land, the page still contains no
  image of a build, a medal, or a person — the gap the section exists to close.
