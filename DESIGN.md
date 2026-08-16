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
| `--wool` | `#8E1B14` | jacket body, the primary field (hero, season, close). Grounds alternate leather / wool down the page; two of the same in a row loses the fold between them |
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
- **`.deal`** — the How to Join trade, as two plain columns rather than cards.
  It replaced four numbered step cards and two bordered panels. The steps
  restated calendar legs 1-3 verbatim; the panels carried kicker labels above
  their headings, which is a banned pattern; and their checkmark bullets put a
  tick beside "we take attendance", which reads as a perk when it is an
  obligation. What survives is the only thing the section knows that the rest
  of the page does not: what it costs you and what you get. One dashed seam
  between the columns, no borders, no numerals, no ticks. The pointer-follow
  light went with the panels; it was a hover treatment on an element with
  nothing to click.
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

One authored moment, and everything else earns its place by doing a job.

The site previously ran fourteen separate motion systems: a scroll-progress
thread, a per-word wipe on every heading, a 26px fade-and-rise on twenty-five
elements, count-up numerals, a canvas halftone field, and a date ticker. Both
the impeccable craft floor and ui-ux-pro-max name the same limit ("animate 1-2
key elements per view", severity High), and one identical entrance on every
section is the most recognisable generated-site behaviour there is. All of it
is gone.

What is left:

- **The hero.** The falcon flight is the signature. `.hero` is 190vh and
  `.hero-stage` is `position: sticky`, so scroll position 0..1 scrubs the
  school mark across a canvas behind pinned copy. It banks along its arc,
  pulses on a 3.5-cycle beat, and stitches a dashed gold thread tracing the
  path already flown. Around it the crest stitches itself on at load, the copy
  yields downward only while the bird is overhead, the crest settles as you
  leave, and a chain-stitch cue plays three times at most to say the hold is
  deliberate. Those read as one moment, not five. Repainted inside
  `requestAnimationFrame`, DPR-capped at 2.
- **Season thread.** A bullion line draws down the calendar, once, on entry.
- **Gallery.** Each `.sew` figure clips open (780ms), its basting stitch pulls
  tight from 18px to its final 7px inset (550ms, +260ms), then the caption
  settles (450ms, +400ms). The wipe direction follows the layout: paired
  figures open toward each other, the full-width closing band opens from its
  centre. This is the only scroll-triggered entrance left on the site.
- **Accordion.** Height animates via `grid-template-rows`, never `max-height`.
- **Anchor glide.** Capped duration, aborts on user scroll. See below.
- **Nav menu.** `grid-template-rows` again, with `visibility` so closed links
  leave the tab order.

Never `linear`. `prefers-reduced-motion` is honoured explicitly, element by
element, rather than by a blanket duration override, so nothing can be left
clipped shut or invisible when a transition never runs.

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
